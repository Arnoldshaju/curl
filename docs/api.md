# LinkForge REST API Documentation

The LinkForge API is fully compliant with OpenAPI 3.0 and can be explored interactively at:
- **Swagger UI:** `http://localhost:8000/api/docs/`
- **ReDoc:** `http://localhost:8000/api/redoc/`
- **Raw OpenAPI Schema:** `http://localhost:8000/api/schema/`

---

## 1. Authentication Endpoints

### Register User
`POST /api/auth/register/`

**Request:**
```json
{
  "username": "developer_arnold",
  "email": "arnold@example.com",
  "password": "StrongPassword123!",
  "password_confirm": "StrongPassword123!"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully.",
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "developer_arnold",
    "email": "arnold@example.com",
    "date_joined": "2026-10-29T12:00:00Z"
  }
}
```

---

### Login User
`POST /api/auth/login/`

**Request:**
```json
{
  "username": "developer_arnold",
  "password": "StrongPassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful.",
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "developer_arnold",
    "email": "arnold@example.com"
  }
}
```

---

## 2. Link Management Endpoints

All authenticated requests require the Authorization header:
```http
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

### Create Short Link
`POST /api/links/`

**Request Body:**
```json
{
  "original_url": "https://github.com/django/django",
  "custom_alias": "django-core",
  "title": "Django Core Repository",
  "expires_in_days": 30
}
```

**Response (201 Created):**
```json
{
  "id": "e4b29c91-2f3b-4c07-9b7e-85a73e6593a2",
  "original_url": "https://github.com/django/django",
  "short_code": "xK8bQ2w",
  "custom_alias": "django-core",
  "effective_code": "django-core",
  "short_url": "http://localhost:8000/r/django-core",
  "title": "Django Core Repository",
  "description": "",
  "is_active": true,
  "is_expired": false,
  "expires_at": "2026-11-28T12:00:00Z",
  "click_count": 0,
  "created_at": "2026-10-29T12:00:00Z",
  "updated_at": "2026-10-29T12:00:00Z"
}
```

---

### List Short Links
`GET /api/links/?search=django&status=active&page=1`

**Response (200 OK):**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "e4b29c91-2f3b-4c07-9b7e-85a73e6593a2",
      "original_url": "https://github.com/django/django",
      "short_code": "xK8bQ2w",
      "custom_alias": "django-core",
      "effective_code": "django-core",
      "short_url": "http://localhost:8000/r/django-core",
      "title": "Django Core Repository",
      "is_active": true,
      "is_expired": false,
      "click_count": 142,
      "created_at": "2026-10-29T12:00:00Z"
    }
  ]
}
```

---

### Retrieve Link Analytics
`GET /api/links/{id}/analytics/`

**Response (200 OK):**
```json
{
  "total_clicks": 142,
  "clicks_by_device": [
    { "device_category": "Desktop", "count": 92 },
    { "device_category": "Mobile", "count": 48 },
    { "device_category": "Tablet", "count": 2 }
  ],
  "clicks_by_browser": [
    { "browser": "Chrome", "count": 78 },
    { "browser": "Safari", "count": 41 },
    { "browser": "Firefox", "count": 23 }
  ],
  "clicks_by_referrer": [
    { "referrer_domain": "github.com", "count": 65 },
    { "referrer_domain": "Direct", "count": 52 },
    { "referrer_domain": "news.ycombinator.com", "count": 25 }
  ],
  "clicks_over_time": [
    { "date": "2026-10-28", "count": 45 },
    { "date": "2026-10-29", "count": 97 }
  ],
  "recent_clicks": [
    {
      "id": "31b1812c-e14b-4f9e-a89f-bb2486716093",
      "clicked_at": "2026-10-29T12:35:12Z",
      "referrer": "https://news.ycombinator.com/",
      "referrer_domain": "news.ycombinator.com",
      "device_category": "Desktop",
      "browser": "Chrome",
      "os": "macOS",
      "country": "Unknown"
    }
  ]
}
```

---

## 3. Redirection Endpoint

`GET /r/{code}/`

**Behavior:**
- **Valid Link:** Returns HTTP 302 Redirect with `Location: <destination_url>`.
- **Expired Link:** Returns HTTP 410 Gone (HTML or JSON based on Accept header).
- **Disabled Link:** Returns HTTP 403 Forbidden with paused notice.
- **Non-existent Link:** Returns HTTP 404 Not Found.
