#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/api"

echo "▶ Seeding database with sample data..."
cd "$BACKEND_DIR"

python manage.py shell <<'PYTHON'
from django.contrib.auth import get_user_model
from apps.tenants.models import Tenant, TenantMembership
from apps.crm.models import Customer

User = get_user_model()

# Superuser
if not User.objects.filter(email="admin@mrkgron.com").exists():
    User.objects.create_superuser(
        email="admin@mrkgron.com",
        password="Admin1234!",
        first_name="Admin",
        last_name="User",
    )
    print("Created superuser: admin@mrkgron.com / Admin1234!")

# Tenant
tenant, _ = Tenant.objects.get_or_create(
    slug="demo",
    defaults={"name": "Demo Tenant", "plan": "pro"},
)
print(f"Tenant: {tenant.name}")

# Sample customers
for i in range(1, 6):
    Customer.objects.get_or_create(
        email=f"customer{i}@example.com",
        defaults={
            "first_name": f"Customer",
            "last_name": str(i),
            "tenant": tenant,
            "status": "active",
            "source": "web",
        },
    )
print("Created 5 sample customers.")
PYTHON

echo "✅ Seed complete."
