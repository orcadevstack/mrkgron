#!/bin/sh
set -eu

mkdir -p /app/staticfiles /app/media
chown -R appuser:appgroup /app/staticfiles /app/media

exec gosu appuser "$@"