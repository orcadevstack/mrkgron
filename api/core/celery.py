"""
Celery application factory for LizConMart.
"""

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "lizconmart.settings.development")

app = Celery("lizconmart")

# Read config from Django settings using the CELERY namespace
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()


@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
