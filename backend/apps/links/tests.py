from datetime import timedelta
from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

# pyrefly: ignore[missing-import]
from apps.links.models import ShortenedURL, ClickAnalytics
# pyrefly: ignore[missing-import]
from apps.links.services import validate_safe_url
# pyrefly: ignore[missing-import]
from apps.analytics.tasks import process_click_record


class LinkForgeCoreTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='alice', password='Password123!')
        self.token1 = Token.objects.create(user=self.user1)

        self.user2 = User.objects.create_user(username='bob', password='Password123!')
        self.token2 = Token.objects.create(user=self.user2)

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        self.links_url = reverse('link-list')
        self.public_create_url = reverse('public-create-link')
        self.health_url = reverse('health-check')

    def test_url_ssrf_and_scheme_validation(self):
        """Verify URL validator rejects invalid schemes, localhost, and internal IPs."""
        # Valid URLs
        self.assertEqual(validate_safe_url("https://example.com/docs"), "https://example.com/docs")
        self.assertEqual(validate_safe_url("http://sub.domain.org/path?q=1"), "http://sub.domain.org/path?q=1")

        # Invalid schemes
        from django.core.exceptions import ValidationError
        with self.assertRaises(ValidationError):
            validate_safe_url("ftp://example.com/file")
        with self.assertRaises(ValidationError):
            validate_safe_url("javascript:alert(1)")

        # Localhost and internal IP rejection
        with self.assertRaises(ValidationError):
            validate_safe_url("http://localhost:8080/admin")
        with self.assertRaises(ValidationError):
            validate_safe_url("http://127.0.0.1/secrets")
        with self.assertRaises(ValidationError):
            validate_safe_url("http://169.254.169.254/latest/meta-data/")
        with self.assertRaises(ValidationError):
            validate_safe_url("http://10.0.0.1/internal")
        with self.assertRaises(ValidationError):
            validate_safe_url("http://192.168.1.1/")

    def test_authenticated_link_creation(self):
        payload = {
            'original_url': 'https://github.com/django/django',
            'title': 'Django Repo',
            'expires_in_days': 14,
        }
        response = self.client.post(self.links_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('short_code', response.data)
        self.assertIn('short_url', response.data)
        self.assertEqual(response.data['title'], 'Django Repo')

        # Verify DB entry
        link = ShortenedURL.objects.get(id=response.data['id'])
        self.assertEqual(link.user, self.user1)
        self.assertTrue(link.is_active)
        self.assertFalse(link.is_expired)

    def test_custom_alias_and_collision_prevention(self):
        # Create link with custom alias
        payload = {
            'original_url': 'https://python.org',
            'custom_alias': 'python-rocks',
        }
        response = self.client.post(self.links_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['custom_alias'], 'python-rocks')
        self.assertEqual(response.data['effective_code'], 'python-rocks')

        # Second attempt with same alias must fail
        dup_payload = {
            'original_url': 'https://different.com',
            'custom_alias': 'python-rocks',
        }
        dup_response = self.client.post(self.links_url, dup_payload)
        self.assertEqual(dup_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('custom_alias', dup_response.data)

    def test_reserved_alias_rejection(self):
        payload = {
            'original_url': 'https://python.org',
            'custom_alias': 'admin',
        }
        response = self.client.post(self.links_url, payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_isolation_and_ownership(self):
        """User Alice cannot view, update, or delete User Bob's links."""
        bobs_link = ShortenedURL.objects.create(
            user=self.user2,
            original_url='https://bob.com',
            short_code='bob12345',
            title='Bob Secret'
        )

        detail_url = reverse('link-detail', kwargs={'pk': bobs_link.pk})

        # Alice tries to view Bob's link
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Alice tries to update Bob's link
        patch_response = self.client.patch(detail_url, {'title': 'Hacked Title'})
        self.assertEqual(patch_response.status_code, status.HTTP_404_NOT_FOUND)

        # Alice tries to delete Bob's link
        del_response = self.client.delete(detail_url)
        self.assertEqual(del_response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(ShortenedURL.objects.filter(id=bobs_link.id).exists())

    def test_public_anonymous_link_creation(self):
        self.client.credentials()  # Unauthenticated
        payload = {
            'original_url': 'https://news.ycombinator.com',
        }
        response = self.client.post(self.public_create_url, payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        link = ShortenedURL.objects.get(id=response.data['id'])
        self.assertIsNone(link.user)
        self.assertTrue(link.is_active)

    def test_redirect_successful(self):
        link = ShortenedURL.objects.create(
            user=self.user1,
            original_url='https://www.wikipedia.org/',
            short_code='wiki9999'
        )
        redirect_url = reverse('url-redirect', kwargs={'code': 'wiki9999'})

        # Anonymous visitor follows redirect
        self.client.credentials()
        response = self.client.get(
            redirect_url,
            HTTP_USER_AGENT='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            HTTP_REFERER='https://google.com/'
        )

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response['Location'], 'https://www.wikipedia.org/')
        self.assertIn('no-cache', response.get('Cache-Control', ''))

    def test_redirect_expired_link(self):
        past_time = timezone.now() - timedelta(days=2)
        link = ShortenedURL.objects.create(
            user=self.user1,
            original_url='https://expired-site.com',
            short_code='exp12345',
            expires_at=past_time
        )
        redirect_url = reverse('url-redirect', kwargs={'code': 'exp12345'})

        # JSON client gets 410 Gone
        response = self.client.get(redirect_url, HTTP_ACCEPT='application/json')
        self.assertEqual(response.status_code, status.HTTP_410_GONE)

    def test_redirect_disabled_link(self):
        link = ShortenedURL.objects.create(
            user=self.user1,
            original_url='https://disabled-site.com',
            short_code='dis12345',
            is_active=False
        )
        redirect_url = reverse('url-redirect', kwargs={'code': 'dis12345'})

        response = self.client.get(redirect_url, HTTP_ACCEPT='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_redirect_not_found(self):
        redirect_url = reverse('url-redirect', kwargs={'code': 'nonexist'})
        response = self.client.get(redirect_url, HTTP_ACCEPT='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_click_analytics_and_anonymization(self):
        link = ShortenedURL.objects.create(
            user=self.user1,
            original_url='https://kernel.org',
            short_code='kern1234'
        )

        # Directly invoke process_click_record to test analytics persistence
        process_click_record(
            link_id=str(link.id),
            referrer='https://news.ycombinator.com/item?id=123',
            user_agent_str='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
            ip_address='203.0.113.195'
        )

        link.refresh_from_db()
        self.assertEqual(link.click_count, 1)

        clicks = ClickAnalytics.objects.filter(shortened_url=link)
        self.assertEqual(clicks.count(), 1)
        click_record = clicks.first()

        self.assertEqual(click_record.device_category, 'Mobile')
        self.assertEqual(click_record.referrer_domain, 'news.ycombinator.com')
        # Check IP was anonymized (hashed), not stored raw
        self.assertNotEqual(click_record.ip_hash, '203.0.113.195')
        self.assertEqual(len(click_record.ip_hash), 32)

        # Test Analytics endpoint
        analytics_url = reverse('link-analytics', kwargs={'pk': link.pk})
        response = self.client.get(analytics_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_clicks'], 1)
        self.assertEqual(len(response.data['clicks_by_device']), 1)
        self.assertEqual(response.data['clicks_by_device'][0]['device_category'], 'Mobile')

    def test_health_check_endpoint(self):
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
        self.assertEqual(response.data['database'], 'connected')
