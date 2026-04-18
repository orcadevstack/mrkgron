#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/api"

echo "▶ Running migrations..."
cd "$BACKEND_DIR"
python manage.py migrate --noinput

echo "✅ Migrations complete."
