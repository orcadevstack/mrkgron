from .base import *  # noqa

DEBUG = True

INSTALLED_APPS = [
	app for app in INSTALLED_APPS if app != "django_elasticsearch_dsl"
]

DATABASES = {
	"default": {
		"ENGINE": "django.db.backends.sqlite3",
		"NAME": BASE_DIR / "db.sqlite3",
	}
}

ALLOWED_HOSTS = ["*"]

# Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Use console email backend
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Django Debug Toolbar (optional)
INSTALLED_APPS += ["django_extensions"]

CACHES = {
	"default": {
		"BACKEND": "django.core.cache.backends.locmem.LocMemCache",
		"LOCATION": "mrkgron-dev",
	}
}

LOGGING["root"]["level"] = "DEBUG"
