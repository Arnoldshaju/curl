from backend.linkforge import settings
from datetime import timedelta
from django.core.cache import cache
from django.db.models import Count, Q
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema, OpenApiResponse, OpenApiParameter

# pyrefly: ignore[missing-import]
from apps.analytics.tasks import record_click
from .models import ShortenedURL, ClickAnalytics
from .serializers import (
    ShortenedURLSerializer,
    CreateShortenedURLSerializer,
    PublicCreateShortenedURLSerializer,
    UpdateShortenedURLSerializer,
    LinkAnalyticsSummarySerializer,
    ClickAnalyticsItemSerializer,
)


def safe_cache_get(key, default=None):
    try:
        return cache.get(key, default)
    except Exception:
        return default

def safe_cache_set(key, value, timeout=300):
    try:
        cache.set(key, value, timeout)
    except Exception:
        pass

def safe_cache_delete(key):
    try:
        cache.delete(key)
    except Exception:
        pass


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class LinkViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        queryset = ShortenedURL.objects.filter(user=user)

        # Optional search
        search = self.request.query_params.get('search', '').strip()
        if search:
            queryset = queryset.filter(
                Q(original_url__icontains=search) |
                Q(short_code__icontains=search) |
                Q(custom_alias__icontains=search) |
                Q(title__icontains=search)
            )

        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None and is_active != '':
            queryset = queryset.filter(is_active=is_active.lower() in ('true', '1'))

        # Filter by expired status
        status_filter = self.request.query_params.get('status')
        now = timezone.now()
        if status_filter == 'expired':
            queryset = queryset.filter(expires_at__lte=now)
        elif status_filter == 'active':
            queryset = queryset.filter(is_active=True).filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))

        return queryset.order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateShortenedURLSerializer
        elif self.action in ('update', 'partial_update'):
            return UpdateShortenedURLSerializer
        return ShortenedURLSerializer

    def create(self, request, *args, **kwargs):
        serializer = CreateShortenedURLSerializer(data=request.data, context={'user': request.user, 'request': request})
        if serializer.is_valid():
            link = serializer.save()
            return Response(
                ShortenedURLSerializer(link, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        instance = serializer.save()
        # Invalidate cache for both short_code and custom_alias
        safe_cache_delete(f"link:{instance.short_code}")
        if instance.custom_alias:
            safe_cache_delete(f"link:{instance.custom_alias}")

    def perform_destroy(self, instance):
        safe_cache_delete(f"link:{instance.short_code}")
        if instance.custom_alias:
            safe_cache_delete(f"link:{instance.custom_alias}")
        instance.delete()

    @extend_schema(
        description="Get detailed analytics and breakdown for a specific shortened link.",
        responses={200: LinkAnalyticsSummarySerializer}
    )
    @action(detail=True, methods=['get'])
    def analytics(self, request, pk=None):
        link = self.get_object()
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        clicks_qs = link.clicks.all()

        # Clicks by Device
        clicks_by_device = list(
            clicks_qs.values('device_category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Clicks by Browser
        clicks_by_browser = list(
            clicks_qs.values('browser')
            .annotate(count=Count('id'))
            .order_by('-count')[:8]
        )

        # Clicks by Referrer Domain
        clicks_by_referrer = list(
            clicks_qs.values('referrer_domain')
            .annotate(count=Count('id'))
            .order_by('-count')[:8]
        )

        # Clicks over time (last 30 days grouped by date)
        # Note: dates are formatted for cross-database compatibility (Postgres/SQLite)
        recent_clicks_qs = clicks_qs.filter(clicked_at__gte=thirty_days_ago)
        clicks_by_date = {}
        for click in recent_clicks_qs.only('clicked_at'):
            d_str = click.clicked_at.strftime('%Y-%m-%d')
            clicks_by_date[d_str] = clicks_by_date.get(d_str, 0) + 1

        clicks_over_time = [
            {'date': d, 'count': c}
            for d, c in sorted(clicks_by_date.items())
        ]

        # Recent 20 individual click logs
        recent_clicks = clicks_qs.order_by('-clicked_at')[:20]

        summary_data = {
            'total_clicks': link.click_count,
            'clicks_by_device': clicks_by_device,
            'clicks_by_browser': clicks_by_browser,
            'clicks_by_referrer': clicks_by_referrer,
            'clicks_over_time': clicks_over_time,
            'recent_clicks': ClickAnalyticsItemSerializer(recent_clicks, many=True).data
        }

        return Response(summary_data, status=status.HTTP_200_OK)


class PublicCreateLinkView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=PublicCreateShortenedURLSerializer,
        responses={
            201: ShortenedURLSerializer,
            400: OpenApiResponse(description="Validation error")
        },
        description="Public endpoint to create a quick shortened URL without logging in."
    )
    def post(self, request):
        serializer = PublicCreateShortenedURLSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            link = serializer.save()
            return Response(
                ShortenedURLSerializer(link, context={'request': request}).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RedirectView(APIView):
    """
    High-performance redirection endpoint:
    GET /r/<slug:code>/
    1. Check Redis cache for instant resolution
    2. Fallback to PostgreSQL database lookup
    3. Verify active status and expiration
    4. Trigger asynchronous Celery click analytics logging
    5. Return HTTP 302 redirect with Location header
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        request=None,
        responses={
            302: OpenApiResponse(description="Temporary Redirect to destination URL"),
            404: OpenApiResponse(description="Short link not found"),
            410: OpenApiResponse(description="Short link has expired"),
        },
        description="Redirect client to the stored destination URL and record analytics."
    )
    def get(self, request, code):
        code = code.strip()
        cache_key = f"link:{code}"

        cached_data = safe_cache_get(cache_key)
        if cached_data:
            destination_url = cached_data['original_url']
            expires_at_ts = cached_data.get('expires_at')
            link_id = cached_data['id']

            # Check expiration
            if expires_at_ts and timezone.now().timestamp() >= expires_at_ts:
                return self.render_expired_response(request, code)

            # Record click asynchronously
            self.dispatch_click_tracking(request, link_id)
            return self.build_redirect(destination_url)

        # Lookup from Database
        link = ShortenedURL.objects.filter(
            Q(short_code=code) | Q(custom_alias=code)
        ).first()

        if not link:
            return self.render_not_found_response(request, code)

        if not link.is_active:
            return self.render_inactive_response(request, code)

        if link.is_expired:
            return self.render_expired_response(request, code)

        # Cache valid link mapping for fast subsequent lookups
        cache_payload = {
            'id': str(link.id),
            'original_url': link.original_url,
            'expires_at': link.expires_at.timestamp() if link.expires_at else None,
        }
        safe_cache_set(cache_key, cache_payload, timeout=300)

        # Asynchronously track click analytics
        self.dispatch_click_tracking(request, link.id)

        return self.build_redirect(link.original_url)

    def dispatch_click_tracking(self, request, link_id):
        referrer = request.META.get('HTTP_REFERER', '')
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')

        record_click(link_id, referrer, user_agent, ip)

    def build_redirect(self, destination_url):
        response = HttpResponseRedirect(destination_url)
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        response['Expires'] = '0'
        return response

    def render_expired_response(self, request, code):
        if 'application/json' in request.META.get('HTTP_ACCEPT', ''):
            return JsonResponse({'error': 'Short link has expired.', 'code': code}, status=410)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Expired — Curl</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #000000; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}
                .card {{ background: #090d16; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 1rem; max-width: 440px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }}
                .badge {{ background: #ef4444; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }}
                h1 {{ font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffffff; }}
                p {{ color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }}
                a {{ background: #00a8ff; color: #000000; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; display: inline-block; transition: background 0.2s; }}
                a:hover {{ background: #0096e6; }}
            </style>
        </head>
        <body>
            <div class="card">
                <span class="badge">410 Gone</span>
                <h1>Link Has Expired</h1>
                <p>The shortened link <code>/{code}</code> has reached its expiration date and is no longer available.</p>
                <a href="{frontend_url}">Go to Curl Home</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html, status=410, content_type='text/html')

    def render_not_found_response(self, request, code):
        if 'application/json' in request.META.get('HTTP_ACCEPT', ''):
            return JsonResponse({'error': 'Short link not found.', 'code': code}, status=404)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Not Found — Curl</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #000000; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}
                .card {{ background: #090d16; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 1rem; max-width: 440px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }}
                .badge {{ background: #f59e0b; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }}
                h1 {{ font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffffff; }}
                p {{ color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }}
                a {{ background: #00a8ff; color: #000000; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; display: inline-block; transition: background 0.2s; }}
                a:hover {{ background: #0096e6; }}
            </style>
        </head>
        <body>
            <div class="card">
                <span class="badge">404 Not Found</span>
                <h1>Short Link Not Found</h1>
                <p>The link <code>/{code}</code> could not be found. It may have been deleted, or the address was mistyped.</p>
                <a href="{frontend_url}">Go to Curl Home</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html, status=404, content_type='text/html')

    def render_inactive_response(self, request, code):
        if 'application/json' in request.META.get('HTTP_ACCEPT', ''):
            return JsonResponse({'error': 'Short link is disabled by owner.', 'code': code}, status=403)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Disabled — Curl</title>
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #000000; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }}
                .card {{ background: #090d16; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 1rem; max-width: 440px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }}
                .badge {{ background: #64748b; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; display: inline-block; margin-bottom: 1rem; }}
                h1 {{ font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffffff; }}
                p {{ color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }}
                a {{ background: #00a8ff; color: #000000; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; display: inline-block; transition: background 0.2s; }}
                a:hover {{ background: #0096e6; }}
            </style>
        </head>
        <body>
            <div class="card">
                <span class="badge">Link Paused</span>
                <h1>Link Disabled</h1>
                <p>The owner of link <code>/{code}</code> has temporarily disabled it.</p>
                <a href="{frontend_url}">Go to Curl Home</a>
            </div>
        </body>
        </html>
        """
        return HttpResponse(html, status=403, content_type='text/html')


class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        description="Comprehensive system health check inspecting Database and Redis connectivity.",
        responses={200: OpenApiResponse(description="System is operational")}
    )
    def get(self, request):
        status_info = {
            "status": "healthy",
            "version": "1.0.0",
            "service": "Curl API",
            "timestamp": timezone.now().isoformat(),
        }

        # Check DB
        try:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            status_info["database"] = "connected"
        except Exception as exc:
            status_info["status"] = "degraded"
            status_info["database"] = f"error: {str(exc)}"

        # Check Cache / Redis
        try:
            cache.set("health_check_ping", "pong", 5)
            val = cache.get("health_check_ping")
            status_info["cache"] = "connected" if val == "pong" else "degraded"
        except Exception as exc:
            status_info["status"] = "degraded"
            status_info["cache"] = f"error: {str(exc)}"

        http_code = status.HTTP_200_OK if status_info["status"] == "healthy" else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(status_info, status=http_code)
