# Acknowledgments & Origins

LinkForge is an independently architected and implemented URL shortening platform developed by Arnold Shaju.

## Inspiration
The conceptual problem space—specifically the exploration of collision handling, conditional writes, expiration semantics, and asynchronous analytics decoupling—was inspired by:
- **Reference Project:** `aws-serverless-url-shortener` by [YourCloudDude](https://github.com/yourclouddude/aws-serverless-url-shortener)

## Independence & Technical Distinctions
While the reference project was an educational serverless exploration implemented with AWS SAM, Python Lambdas, and Amazon DynamoDB with no frontend or authentication, **LinkForge** is built from the ground up as a complete production-grade SaaS product using a totally separate, modern stack:
- **Frontend:** Next.js (App Router), React, TypeScript, and Tailwind CSS.
- **Backend:** Django, Django REST Framework, PostgreSQL, Redis, Celery, and Gunicorn.
- **Security:** Anti-SSRF internal IP blacklisting, cryptographic collision checking, user ownership isolation, and SHA-256 hashed privacy analytics.
- **DevOps:** Multi-container Docker Compose, Nginx reverse proxy, and AWS EC2 deployment strategy.

No code, proprietary assets, or distinctive branding from the reference repository were copied. LinkForge represents a complete, clean-room implementation.
