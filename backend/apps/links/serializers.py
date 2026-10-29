from datetime import timedelta
from django.conf import settings
from django.db import transaction
from django.db.models import Count
from django.utils import timezone
from rest_framework import serializers

from .models import ShortenedURL, ClickAnalytics
from .services import (
    validate_safe_url,
    validate_custom_alias,
    generate_short_code,
)


from drf_spectacular.utils import extend_schema_field


class ShortenedURLSerializer(serializers.ModelSerializer):
    short_url = serializers.SerializerMethodField()
    is_expired = serializers.BooleanField(read_only=True)
    effective_code = serializers.CharField(read_only=True)

    class Meta:
        model = ShortenedURL
        fields = (
            'id',
            'original_url',
            'short_code',
            'custom_alias',
            'effective_code',
            'short_url',
            'title',
            'description',
            'is_active',
            'is_expired',
            'expires_at',
            'click_count',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'short_code',
            'effective_code',
            'short_url',
            'is_expired',
            'click_count',
            'created_at',
            'updated_at',
        )

    @extend_schema_field(str)
    def get_short_url(self, obj):
        request = self.context.get('request')
        base = getattr(settings, 'NEXT_PUBLIC_SHORT_DOMAIN', None)
        if not base and request:
            base = request.build_absolute_uri('/r')
        return obj.get_short_url(base)


class CreateShortenedURLSerializer(serializers.Serializer):
    original_url = serializers.CharField(max_length=2048, required=True)
    custom_alias = serializers.CharField(
        max_length=50,
        required=False,
        allow_blank=True,
        default=None
    )
    title = serializers.CharField(max_length=255, required=False, allow_blank=True, default='')
    description = serializers.CharField(required=False, allow_blank=True, default='')
    expires_in_days = serializers.IntegerField(
        required=False,
        min_value=1,
        max_value=365,
        default=None
    )
    expires_at = serializers.DateTimeField(required=False, default=None)

    def validate_original_url(self, value):
        from django.core.exceptions import ValidationError as DjangoValidationError
        try:
            return validate_safe_url(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(str(exc.message if hasattr(exc, 'message') else exc))

    def validate_custom_alias(self, value):
        if not value:
            return None
        from django.core.exceptions import ValidationError as DjangoValidationError
        try:
            cleaned = validate_custom_alias(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(str(exc.message if hasattr(exc, 'message') else exc))

        # Check collision with existing aliases or short codes
        if ShortenedURL.objects.filter(custom_alias__iexact=cleaned).exists() or \
           ShortenedURL.objects.filter(short_code__iexact=cleaned).exists():
            raise serializers.ValidationError(f"The custom alias '{cleaned}' is already taken.")
        return cleaned

    def validate(self, attrs):
        now = timezone.now()
        expires_at = attrs.get('expires_at')
        expires_in_days = attrs.get('expires_in_days')

        if expires_at and expires_at <= now:
            raise serializers.ValidationError({"expires_at": "Expiration date must be in the future."})

        if expires_in_days and not expires_at:
            attrs['computed_expires_at'] = now + timedelta(days=expires_in_days)
        elif expires_at:
            attrs['computed_expires_at'] = expires_at
        else:
            default_days = getattr(settings, 'DEFAULT_EXPIRY_DAYS', 30)
            attrs['computed_expires_at'] = now + timedelta(days=default_days)

        return attrs

    def create(self, validated_data):
        user = self.context.get('user')
        original_url = validated_data['original_url']
        custom_alias = validated_data.get('custom_alias')
        title = validated_data.get('title', '')
        description = validated_data.get('description', '')
        expires_at = validated_data.get('computed_expires_at')

        # Generate unique collision-safe short code with transaction retry
        max_retries = 10
        for _ in range(max_retries):
            candidate_code = generate_short_code()
            if not ShortenedURL.objects.filter(short_code=candidate_code).exists() and \
               not ShortenedURL.objects.filter(custom_alias=candidate_code).exists():
                try:
                    with transaction.atomic():
                        instance = ShortenedURL.objects.create(
                            user=user,
                            original_url=original_url,
                            short_code=candidate_code,
                            custom_alias=custom_alias,
                            title=title,
                            description=description,
                            expires_at=expires_at,
                            is_active=True
                        )
                        return instance
                except Exception:
                    continue

        raise serializers.ValidationError("Failed to allocate a unique short code. Please try again.")


class PublicCreateShortenedURLSerializer(CreateShortenedURLSerializer):
    """Simplified serializer for anonymous public link creation."""
    def create(self, validated_data):
        self.context['user'] = None
        return super().create(validated_data)


class UpdateShortenedURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedURL
        fields = ('title', 'description', 'is_active', 'expires_at')

    def validate_expires_at(self, value):
        if value and value <= timezone.now():
            raise serializers.ValidationError("Expiration date must be in the future.")
        return value


class ClickAnalyticsItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClickAnalytics
        fields = (
            'id',
            'clicked_at',
            'referrer',
            'referrer_domain',
            'device_category',
            'browser',
            'os',
            'country',
        )


class LinkAnalyticsSummarySerializer(serializers.Serializer):
    total_clicks = serializers.IntegerField()
    clicks_by_device = serializers.ListField()
    clicks_by_browser = serializers.ListField()
    clicks_by_referrer = serializers.ListField()
    clicks_over_time = serializers.ListField()
    recent_clicks = ClickAnalyticsItemSerializer(many=True)
