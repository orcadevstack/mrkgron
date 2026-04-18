#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/api"

echo "▶ Running database migrations..."
cd "$BACKEND_DIR"
python manage.py migrate --noinput

echo "▶ Collecting static files..."
python manage.py collectstatic --noinput

echo "▶ Starting Django development server..."
python manage.py runserver 0.0.0.0:8000
