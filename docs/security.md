# Curl Security Architecture & Safeguards

This document outlines the security controls, validation boundaries, and threat mitigation models engineered into Curl.

---

## 1. Threat Mitigation Matrix

| Potential Vulnerability | Risk | Curl Defense Mechanism |
|---|---|---|
| **Server-Side Request Forgery (SSRF)** | Attacker inputs `http://169.254.169.254/` to steal AWS instance role credentials or internal network IPs | Dynamic DNS resolution checking IP against RFC 1918 private subnets, loopbacks (`127.0.0.1`), link-local (`169.254.0.0/16`), and AWS metadata service (`169.254.169.254`). |
| **Short Code Collision / Overwrite** | Two concurrent requests generate the same code, overwriting existing destination | Cryptographic random generation + Django database atomic transactions (`with transaction.atomic()`) with unique index constraints and retry loops. |
| **Open Redirect Abuse** | Platform used as a redirector for phishing or malicious payloads | Validation enforces absolute URLs, restricts schemes strictly to `http` and `https`, and rejects invalid schemes (`javascript:`, `data:`, `file:`, `ftp:`). |
| **Visitor Privacy Violations (GDPR/CCPA)** | Storing raw visitor IP addresses creates PII compliance liabilities | Client IP addresses are combined with an application salt and hashed using **SHA-256**. Only a truncated 32-character hash is persisted for duplicate detection; raw IPs are discarded. |
| **Slowloris / Redirect Latency Denial** | Synchronous analytics database writes degrade redirect responsiveness | High-performance Redis caching on the redirect hot path coupled with asynchronous Celery workers handling analytics in background queues. |
| **Unauthorized Data Access (BOLA / IDOR)** | User modifies or views links created by another user | Queryset scoping is strictly filtered by the authenticated user (`ShortenedURL.objects.filter(user=request.user)`), preventing cross-tenant data leakage. |

---

## 2. Anti-SSRF Implementation Details

In `apps/links/services.py`, URL validation executes:
```python
def validate_safe_url(raw_url: str) -> str:
    parsed = urlparse(raw_url)
    if parsed.scheme.lower() not in ('http', 'https'):
        raise ValidationError("URL must use either http:// or https:// protocol.")
    
    # 1. Reject localhost and direct loopback IPs
    if hostname.lower() in ('localhost', '127.0.0.1', '::1', '0.0.0.0'):
        raise ValidationError("Redirecting to localhost or loopback addresses is prohibited.")
        
    # 2. Check if hostname is directly an IP address
    if is_private_ip(hostname):
        raise ValidationError("Redirecting to internal or private IP addresses is prohibited.")
        
    # 3. Resolve DNS with non-blocking timeout to detect private IP resolution
    resolved_ips = socket.getaddrinfo(hostname, None)
    for entry in resolved_ips:
        ip_candidate = entry[4][0]
        if is_private_ip(ip_candidate):
            raise ValidationError("Redirecting to internal or private IP addresses is prohibited.")
```

---

## 3. Secret Management & Production Hardening

1. **No Hardcoded Secrets:**
   All cryptographic keys, database passwords, and environment credentials reside strictly in `.env` and are excluded from Git through `.gitignore`.
2. **Reverse Proxy Isolation:**
   PostgreSQL (`5432`) and Redis (`6379`) do not expose ports on public network interfaces in production.
3. **Session & Token Invalidation:**
   Logging out deletes the authentication token on the backend server, rendering subsequent requests with that token immediately unauthorized.
