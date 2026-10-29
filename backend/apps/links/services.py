import ipaddress
import re
import secrets
import socket
import string
from urllib.parse import urlparse
from django.conf import settings
from django.core.exceptions import ValidationError

ALPHABET = string.ascii_letters + string.digits
CUSTOM_ALIAS_REGEX = re.compile(r'^[a-zA-Z0-9_-]{3,50}$')

# Reserved paths that cannot be used as custom aliases or short codes
RESERVED_CODES = {
    'api', 'admin', 'auth', 'health', 'docs', 'schema', 'dashboard',
    'login', 'register', 'logout', 'static', 'media', 'settings',
    'analytics', 'r', 'terms', 'privacy', 'about', 'help', 'app'
}


def is_private_ip(ip_str: str) -> bool:
    """Check if an IP address is private, loopback, link-local, or multicast."""
    try:
        ip = ipaddress.ip_address(ip_str)
        return (
            ip.is_private or
            ip.is_loopback or
            ip.is_link_local or
            ip.is_multicast or
            ip.is_reserved or
            ip.is_unspecified or
            str(ip) == '169.254.169.254'  # AWS EC2 metadata service
        )
    except ValueError:
        # String is a domain name, not an IP address
        return False


def validate_safe_url(raw_url: str) -> str:
    """
    Validate that the destination URL is safe:
    - Absolute URL with http or https scheme
    - Length <= 2048 chars
    - Anti-SSRF protection: hostname cannot resolve to internal/private IPs or metadata
    """
    if not isinstance(raw_url, str):
        raise ValidationError("URL must be a valid string.")

    url = raw_url.strip()
    if not url:
        raise ValidationError("URL is required.")

    if len(url) > 2048:
        raise ValidationError("URL cannot exceed 2048 characters.")

    parsed = urlparse(url)
    if parsed.scheme.lower() not in ('http', 'https'):
        raise ValidationError("URL must use either http:// or https:// protocol.")

    hostname = parsed.hostname
    if not hostname:
        raise ValidationError("URL must contain a valid hostname.")

    # Block localhost explicitly
    if hostname.lower() in ('localhost', '127.0.0.1', '::1', '0.0.0.0'):
        raise ValidationError("Redirecting to localhost or loopback addresses is prohibited.")

    # Check for direct IP in URL
    try:
        if is_private_ip(hostname):
            raise ValidationError("Redirecting to internal or private IP addresses is prohibited.")
    except ValidationError:
        raise
    except Exception:
        pass

    # Quick SSRF check with timeout
    old_timeout = socket.getdefaulttimeout()
    try:
        socket.setdefaulttimeout(0.5)
        resolved_ips = socket.getaddrinfo(hostname, None)
        for entry in resolved_ips:
            ip_candidate = entry[4][0]
            if is_private_ip(ip_candidate):
                raise ValidationError("Redirecting to internal or private IP addresses is prohibited.")
    except socket.gaierror:
        pass
    except (socket.timeout, TimeoutError):
        pass
    except ValidationError:
        raise
    except Exception:
        pass
    finally:
        socket.setdefaulttimeout(old_timeout)

    return url


def validate_custom_alias(alias: str) -> str:
    """Validate format and ensure alias is not a reserved system path."""
    if not alias:
        return ""
    cleaned = alias.strip()
    if not CUSTOM_ALIAS_REGEX.match(cleaned):
        raise ValidationError(
            "Custom alias must be 3-50 characters long and contain only alphanumeric characters, dashes, and underscores."
        )
    if cleaned.lower() in RESERVED_CODES:
        raise ValidationError(f"The alias '{cleaned}' is reserved and cannot be used.")
    return cleaned


def generate_short_code(length: int = None) -> str:
    """Generate a cryptographically random, URL-safe base62 string."""
    code_len = length or getattr(settings, 'CODE_LENGTH', 7)
    return ''.join(secrets.choice(ALPHABET) for _ in range(code_len))
