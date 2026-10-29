from django.contrib import admin
from .models import ShortenedURL, ClickAnalytics


@admin.register(ShortenedURL)
class ShortenedURLAdmin(admin.ModelAdmin):
    list_display = ('short_code', 'custom_alias', 'user', 'is_active', 'click_count', 'expires_at', 'created_at')
    list_filter = ('is_active', 'created_at', 'expires_at')
    search_fields = ('short_code', 'custom_alias', 'original_url', 'title', 'user__username')
    readonly_fields = ('id', 'click_count', 'created_at', 'updated_at')


@admin.register(ClickAnalytics)
class ClickAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('shortened_url', 'clicked_at', 'device_category', 'browser', 'referrer_domain')
    list_filter = ('device_category', 'browser', 'clicked_at')
    search_fields = ('shortened_url__short_code', 'referrer', 'ip_hash')
    readonly_fields = ('id', 'clicked_at', 'ip_hash')
