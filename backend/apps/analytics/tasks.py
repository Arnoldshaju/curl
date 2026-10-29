import hashlib
from urllib.parse import urlparse
from celery import shared_task
from django.conf import settings
from django.db import transaction
from django.db.models import F
from user_agents import parse as parse_user_agent


def anonymize_ip(ip_address: str) -> str:
    """Hash IP address with secret key salt for privacy-conscious analytics."""
    if not ip_address:
        return ""
    salt = getattr(settings, 'SECRET_KEY', 'default-salt')[:16]
    return hashlib.sha256(f"{ip_address}:{salt}".encode('utf-8')).hexdigest()[:32]


def extract_referrer_domain(referrer: str) -> str:
    """Extract clean domain from HTTP referrer header."""
    if not referrer:
        return 'Direct'
    try:
        parsed = urlparse(referrer)
        domain = parsed.netloc or parsed.path
        return domain.lower() if domain else 'Direct'
    except Exception:
        return 'Direct'


def parse_device_info(ua_string: str) -> dict:
    """Parse user agent string into categories."""
    if not ua_string:
        return {
            'device_category': 'Desktop',
            'browser': 'Direct / None',
            'os': 'Unknown'
        }
    try:
        ua = parse_user_agent(ua_string)
        if ua.is_bot:
            device = 'Bot'
        elif ua.is_mobile:
            device = 'Mobile'
        elif ua.is_tablet:
            device = 'Tablet'
        elif ua.is_pc:
            device = 'Desktop'
        else:
            device = 'Other'

        return {
            'device_category': device,
            'browser': ua.browser.family or 'Unknown',
            'os': ua.os.family or 'Unknown'
        }
    except Exception:
        return {
            'device_category': 'Desktop',
            'browser': 'Unknown',
            'os': 'Unknown'
        }


def process_click_record(link_id: str, referrer: str, user_agent_str: str, ip_address: str):
    """Core logic to update click count and persist analytics record."""
    from apps.links.models import ShortenedURL, ClickAnalytics

    try:
        url_obj = ShortenedURL.objects.filter(id=link_id).first()
        if not url_obj:
            return

        device_info = parse_device_info(user_agent_str)
        ref_domain = extract_referrer_domain(referrer)
        hashed_ip = anonymize_ip(ip_address)

        with transaction.atomic():
            # Atomically increment click count on the link
            ShortenedURL.objects.filter(id=link_id).update(click_count=F('click_count') + 1)

            # Record detailed click event
            ClickAnalytics.objects.create(
                shortened_url=url_obj,
                referrer=referrer[:500] if referrer else 'Direct',
                referrer_domain=ref_domain[:250],
                user_agent=user_agent_str[:1000] if user_agent_str else '',
                device_category=device_info['device_category'],
                browser=device_info['browser'],
                os=device_info['os'],
                country='Unknown',
                ip_hash=hashed_ip
            )
    except Exception as exc:
        # Analytics recording must never crash or raise unhandled exceptions
        import logging
        logging.getLogger(__name__).error(f"Error recording click analytics: {exc}")


@shared_task(bind=True, max_retries=3, default_retry_delay=5)
def record_click_async(self, link_id: str, referrer: str, user_agent_str: str, ip_address: str):
    """Celery background task for asynchronous click analytics processing."""
    try:
        process_click_record(link_id, referrer, user_agent_str, ip_address)
    except Exception as exc:
        try:
            self.retry(exc=exc)
        except Exception:
            pass


def record_click(link_id: str, referrer: str, user_agent_str: str, ip_address: str):
    """Dispatches async task if Celery is running, otherwise runs synchronously."""
    try:
        record_click_async.delay(str(link_id), referrer, user_agent_str, ip_address)
    except Exception:
        # Fallback to direct synchronous execution if Celery broker is unavailable
        process_click_record(str(link_id), referrer, user_agent_str, ip_address)
