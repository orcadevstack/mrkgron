# LizConMart

Enterprise-grade Marketing Automation, CRM, Analytics & E-Commerce platform built with Django + Next.js.

---

## Architecture

```
lizconmart/
├── api/              # Django 4.2 REST API
│   ├── apps/
│   │   ├── authentication/   # JWT auth, user management
│   │   ├── tenants/          # Multi-tenancy
│   │   ├── crm/              # Customer management
│   │   ├── communications/   # Campaigns, email, SMS
│   │   ├── messaging/        # Threaded messaging
│   │   ├── segments/         # Customer segmentation
│   │   ├── journeys/         # Customer journey automation
│   │   ├── analytics/        # Events, metrics, dashboards
│   │   ├── commerce/         # Products, orders, payments
│   │   └── automation/       # Workflow automation engine
│   ├── core/                 # Celery, utils, middleware
│   └── lizconmart/           # Django settings
├── webapp/           # Next.js 14 TypeScript app
│   └── src/
│       ├── app/              # App Router pages
│       ├── components/       # Reusable UI components
│       ├── lib/              # API client, auth, utils
│       ├── store/            # Redux Toolkit store
│       └── types/            # TypeScript types
├── nginx/            # Nginx reverse proxy
├── scripts/          # Dev helper scripts
└── docker-compose.yml
```

---

## Quick Start (Docker)

```bash
# 1. Copy and configure environment
cp api/.env.example api/.env
cp webapp/.env.local.example webapp/.env.local
# Edit both files with your secrets

# 2. Start all services
docker compose up --build

# 3. Seed the database (in another terminal)
docker compose exec api bash /app/../scripts/seed.sh
```

Services:
| Service        | URL                          |
|----------------|------------------------------|
| Webapp         | http://localhost:3000        |
| Django API     | http://localhost:8000/api/v1 |
| Django Admin   | http://localhost:8000/admin  |
| API Docs       | http://localhost:8000/api/v1/docs |

---

## Local Development (without Docker)

### API (Django)

```bash
cd api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit with local DB/Redis settings

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# In a second terminal:
celery -A core worker -l info

# In a third terminal (optional):
celery -A core beat -l info
```

### Webapp (Next.js)

```bash
cd webapp
npm install
cp .env.local.example .env.local
npm run dev
```

---

## API Overview

Base URL: `/api/v1/`

| Module          | Endpoints                                   |
|-----------------|---------------------------------------------|
| Auth            | `/auth/` (login, register, me, logout)      |
| Tenants         | `/tenants/`                                 |
| CRM             | `/crm/customers/`, `/crm/interactions/`     |
| Communications  | `/communications/campaigns/`, `/templates/` |
| Segments        | `/segments/`                                |
| Journeys        | `/journeys/`                                |
| Analytics       | `/analytics/dashboards/`, `/metrics/`       |
| Commerce        | `/commerce/products/`, `/orders/`, `/cart/` |
| Automation      | `/automation/workflows/`, `/triggers/`      |

Interactive docs: `GET /api/v1/docs/`

---

## Tech Stack

| Layer       | Technology                                          |
|-------------|-----------------------------------------------------|
| Backend     | Django 4.2, Django REST Framework, Celery           |
| Database    | PostgreSQL 15                                       |
| Cache/Queue | Redis 7                                             |
| Search      | Elasticsearch 8                                     |
| Frontend    | Next.js 14, TypeScript, TailwindCSS, Redux Toolkit  |
| Auth        | JWT (simplejwt), multi-tenant middleware            |
| Email       | SendGrid (anymail)                                  |
| SMS         | Twilio                                              |
| Payments    | Stripe                                              |
| Storage     | AWS S3 (django-storages)                            |
| Proxy       | Nginx                                               |

---

## Scripts

| Script              | Purpose                                    |
|---------------------|--------------------------------------------|
| `scripts/start.sh`  | Migrate + collectstatic + runserver        |
| `scripts/migrate.sh`| Run migrations only                        |
| `scripts/seed.sh`   | Seed superuser, tenant, sample customers   |

---

## Default Credentials (seed data)

| Role       | Email                    | Password     |
|------------|--------------------------|--------------|
| Superuser  | admin@lizconmart.com     | Admin1234!   |

**Change these immediately in production.**

---

## License

MIT
