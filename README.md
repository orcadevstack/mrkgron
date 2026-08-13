# Mrkgron

Enterprise-grade Marketing Automation, CRM, Analytics & E-Commerce platform built with Django + Next.js.

Deployment and operations instructions are maintained in the versioned [project wiki](docs/DEPLOYMENT.md).

---

## Architecture

```
mrkgron/
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
│   └── mrkgron/           # Django settings
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
| Superuser  | admin@mrkgron.com     | Admin1234!   |

**Change these immediately in production.**

---

## Customer Engagement Platform Overview

### What This Platform Is

The Customer Engagement Platform is a unified system for understanding users, automating lifecycle communication, and managing multi-tenant organizations. It brings together four core capabilities — **Segments**, **Journeys**, **Messaging**, and **Tenants** — to help teams deliver personalized, timely, and scalable customer experiences.

Instead of stitching together multiple tools, this platform provides a single, cohesive environment where teams can define audiences, automate workflows, communicate across channels, and manage organizations with clarity and control.

---

### Why It Exists

Modern SaaS companies need more than just analytics or messaging. They need a way to:

- Understand who their users are
- Trigger the right actions at the right time
- Communicate across multiple channels
- Manage multiple organizations and roles
- Scale without operational overhead

This platform solves those needs by combining data, automation, and communication into one integrated system.

---

### Core Modules

#### 1. Segments — Understand and Organize Your Users

Segments allow teams to group users based on attributes, behaviors, or lifecycle criteria. These segments become the foundation for targeting, personalization, and automation.

**What Segments Enable**
- Real-time audience definitions
- Dynamic and static segmentation
- Targeted messaging and campaigns
- Journey triggers
- Behavioral insights

**Key Features**
- KPI strip showing segment distribution
- Dynamic vs static segment badges
- Auto-refresh indicators and timestamps
- Manual refresh for dynamic segments
- Pagination and empty states
- Backend integration for refresh actions

---

#### 2. Journeys — Automate Customer Lifecycle Flows

Journeys let teams build automated workflows that guide users through onboarding, activation, retention, and re-engagement.

**What Journeys Enable**
- Automated onboarding sequences
- Behavioral triggers and branching logic
- Re-engagement and win-back flows
- Multi-step lifecycle automation
- Consistent, scalable customer experiences

**Key Features**
- KPI strip for journey states
- Filter tabs for lifecycle management
- Card grid with trigger and re-entry indicators
- State actions: Play, Pause, Archive
- Backend integration for journey state transitions

---

#### 3. Messaging — Multi-Channel Customer Communication

Messaging provides a unified inbox for all inbound and outbound communication across channels like email, SMS, WhatsApp, push, and in-app messages.

**What Messaging Enables**
- Centralized customer conversations
- Multi-channel communication from one interface
- Support workflows and follow-ups
- Automated and manual replies
- Full conversation history

**Key Features**
- Split-pane inbox (threads + message view)
- Filters for open, closed, and all threads
- Channel badges for quick identification
- Threaded conversation layout
- Reply composer with keyboard shortcuts
- Backend integration for sending replies

---

#### 4. Tenants — Multi-Tenant SaaS Administration

Tenants allow the platform to support multiple organizations, each with its own members, roles, and lifecycle state.

**What Tenants Enable**
- Multi-organization SaaS environments
- Role-based access control
- Plan-level management
- Enterprise onboarding
- Organization-level administration

**Key Features**
- KPI strip for plan distribution
- Expandable tenant rows with member rosters
- Activate/deactivate toggles
- Inline invite form with role selection
- Role badges for owners, admins, and members
- Backend integration for tenant updates and invites

---

### How Everything Works Together

The platform is designed so each module reinforces the others:

| Module | Role |
|---|---|
| **Segments** | Define who your users are |
| **Journeys** | Automate what happens to them |
| **Messaging** | Communicate with them |
| **Tenants** | Organize everything at the SaaS level |

This creates a complete customer engagement ecosystem that supports both small teams and enterprise-scale organizations.

---

### Who This Platform Is For

- SaaS companies building lifecycle automation
- Customer success and support teams
- Growth and marketing teams
- Product teams needing behavioral triggers
- Platforms requiring multi-tenant architecture

---

### What Makes It Different

- Built with modern TypeScript and React
- Clean, modular architecture
- Real-time data flows
- Multi-channel communication
- Enterprise-ready tenant management
- Unified experience instead of fragmented tools

---

## License

MIT
