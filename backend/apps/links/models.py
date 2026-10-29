import uuid
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class ShortenedURL(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='shortened_urls',
        null=True,
        blank=True,
        help_text="Owning user account. Null for anonymous quick links."
    )
    original_url = models.URLField(max_length=2048, db_index=True)
    short_code = models.CharField(max_length=32, unique=True, db_index=True)
    custom_alias = models.CharField(
        max_length=64,
        unique=True,
        null=True,
        blank=True,
        db_index=True
    )
    title = models.CharField(max_length=255, blank=True, default='')
    description = models.TextField(blank=True, default='')
    is_active = models.BooleanField(default=True, db_index=True)
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    click_count = models.PositiveIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['short_code']),
            models.Index(fields=['custom_alias']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_active', 'expires_at']),
        ]

    def __str__(self):
        alias_str = f" ({self.custom_alias})" if self.custom_alias else ""
        return f"{self.short_code}{alias_str} -> {self.original_url[:40]}"

    @property
    def is_expired(self) -> bool:
        if not self.expires_at:
            return False
        return timezone.now() >= self.expires_at

    @property
    def effective_code(self) -> str:
        return self.custom_alias if self.custom_alias else self.short_code

    def get_short_url(self, base_url: str = None) -> str:
        domain = base_url or getattr(settings, 'NEXT_PUBLIC_SHORT_DOMAIN', 'http://localhost:8000/r')
        domain = domain.rstrip('/')
        return f"{domain}/{self.effective_code}"


class ClickAnalytics(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    shortened_url = models.ForeignKey(
        ShortenedURL,
        on_delete=models.CASCADE,
        related_name='clicks'
    )
    clicked_at = models.DateTimeField(default=timezone.now, db_index=True)
    referrer = models.CharField(max_length=512, blank=True, default='Direct')
    referrer_domain = models.CharField(max_length=255, blank=True, default='Direct', db_index=True)
    user_agent = models.TextField(blank=True, default='')
    device_category = models.CharField(max_length=50, default='Desktop', db_index=True)
    browser = models.CharField(max_length=100, default='Unknown', db_index=True)
    os = models.CharField(max_length=100, default='Unknown', db_index=True)
    country = models.CharField(max_length=100, default='Unknown', db_index=True)
    ip_hash = models.CharField(max_length=64, blank=True, default='', db_index=True)

    class Meta:
        ordering = ['-clicked_at']
        indexes = [
            models.Index(fields=['shortened_url', '-clicked_at']),
            models.Index(fields=['device_category']),
            models.Index(fields=['referrer_domain']),
        ]

    def __str__(self):
        return f"Click on {self.shortened_url.short_code} at {self.clicked_at}"
