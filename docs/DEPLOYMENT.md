# Mrkgron Deployment Wiki

## Architecture

Mrkgron runs as Docker Compose services:

| Service | Responsibility |
| --- | --- |
| `nginx` | Public HTTP entrypoint and reverse proxy |
| `webapp` | Next.js frontend |
| `api` | Django REST API and admin |
| `celery`, `celery-beat` | Background jobs and schedules |
| `db`, `redis`, `elasticsearch` | Data, queue, and search infrastructure |

Use Nginx as the public entrypoint. The frontend calls `/api/v1` on the same domain, so the browser never needs to know the internal `api` container address.

## Local Docker Startup

1. Create the API environment file:

   ```bash
   cp api/.env.example api/.env
   ```

2. Start the stack:

   ```bash
   docker compose up --build -d
   ```

3. Confirm service state and health:

   ```bash
   docker compose ps
   curl --fail http://localhost/health/
   curl --fail -o /dev/null http://localhost/
   ```

Open `http://localhost/` for the application, `http://localhost/admin/` for Django Admin, and `http://localhost/api/v1/docs/` for API documentation.

## Server Deployment

### Prerequisites

- Docker Engine with Docker Compose v2
- A DNS record for the host
- A reverse proxy or load balancer that terminates TLS before Nginx
- AWS S3 credentials if using `mrkgron.settings.production`

### Configure Production Environment

Copy the example and set production values in `api/.env`:

```dotenv
SECRET_KEY=<a-unique-random-secret>
DEBUG=False
ALLOWED_HOSTS=app.example.com,api.example.com
DJANGO_SETTINGS_MODULE=mrkgron.settings.production

DB_NAME=mrkgron
DB_USER=<strong-database-user>
DB_PASSWORD=<strong-database-password>
DB_HOST=db
DB_PORT=5432
DB_SSLMODE=disable

REDIS_URL=redis://redis:6379/0
ELASTICSEARCH_URL=http://elasticsearch:9200
CORS_ALLOWED_ORIGINS=https://app.example.com
DEFAULT_FROM_EMAIL=noreply@app.example.com

AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
AWS_STORAGE_BUCKET_NAME=<private-bucket-name>
AWS_S3_REGION_NAME=<aws-region>
```

Do not commit `api/.env`. It contains credentials and is ignored by Git.

Set the public frontend URL before building. For the standard single-domain Nginx deployment, keep the relative API path:

```bash
export NEXT_PUBLIC_API_URL=/api/v1
```

For a separately hosted API, use its public HTTPS URL instead, for example `https://api.example.com/api/v1`.

### Launch and Update

Run these commands from the repository root on the server:

```bash
docker compose pull
docker compose up --build -d
docker compose ps
curl --fail https://app.example.com/health/
```

For each code update, pull the new code, rebuild, and apply migrations through the API container:

```bash
git pull
docker compose up --build -d
docker compose exec api python manage.py migrate --noinput
docker compose ps
```

The API service also runs migrations on startup. Running them explicitly during a release makes the deployment step visible and repeatable.

## GitHub Pages Frontend

The included GitHub Actions workflow publishes a static frontend to GitHub Pages after pushes to `main`. It does not deploy Django, PostgreSQL, Redis, Celery, or Elasticsearch.

Before enabling Pages, set the API endpoint in [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml) to the public HTTPS API URL. The API host must allow the Pages origin through `CORS_ALLOWED_ORIGINS`.

## Operations

View all logs:

```bash
docker compose logs --tail=200
```

View a single service:

```bash
docker compose logs --tail=200 api
```

Restart a service after configuration changes:

```bash
docker compose up -d --force-recreate api celery celery-beat
```

Stop the stack without deleting data:

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete PostgreSQL, Redis, Elasticsearch, static, and media volumes.

## Release Checklist

- `SECRET_KEY`, database password, and third-party credentials are unique production secrets.
- `DEBUG=False` and `DJANGO_SETTINGS_MODULE=mrkgron.settings.production` are set.
- `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` contain the production domains.
- TLS is configured at the public proxy or load balancer.
- S3 credentials and bucket access are configured for production static and media storage.
- `docker compose ps` shows required services running.
- `curl --fail https://<domain>/health/` succeeds after deployment.