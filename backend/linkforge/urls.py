from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from apps.links.views import RedirectView, HealthCheckView

from django.conf import settings
from django.views.generic.base import RedirectView as DjangoRedirectView

urlpatterns = [
    # Root / welcome route redirects to frontend shortener landing page
    path('', DjangoRedirectView.as_view(url=getattr(settings, 'FRONTEND_URL', 'http://localhost:3000'), permanent=False), name='backend-root'),

    path('admin/', admin.site.urls),

    # Health check
    path('api/health/', HealthCheckView.as_view(), name='health-check'),

    # API Documentation (OpenAPI 3.0 / Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # LinkForge API endpoints
    path('api/auth/', include('apps.authentication.urls')),
    path('api/', include('apps.links.urls')),

    # Short URL Redirection: /r/<code>
    re_path(r'^r/(?P<code>[a-zA-Z0-9_-]+)/?$', RedirectView.as_view(), name='url-redirect'),
]
