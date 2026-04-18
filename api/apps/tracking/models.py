"""
Tracking models — raw behavioral event ingestion.

Pipeline: Ingestion → Normalization → Identity Resolution → Storage → Analytics
"""

import uuid
from django.conf import settings
from django.db import models


class Session(models.Model):
    """A visitor session (anonymous or authenticated)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="sessions")
    session_key = models.CharField(max_length=128, db_index=True)
    # Resolved customer after identity resolution
    customer = models.ForeignKey(
        "crm.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="sessions"
    )
    anonymous_id = models.CharField(max_length=128, blank=True, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True, max_length=2048)
    utm_source = models.CharField(max_length=255, blank=True)
    utm_medium = models.CharField(max_length=255, blank=True)
    utm_campaign = models.CharField(max_length=255, blank=True)
    utm_content = models.CharField(max_length=255, blank=True)
    utm_term = models.CharField(max_length=255, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    last_seen_at = models.DateTimeField(auto_now=True)
    is_identified = models.BooleanField(default=False)

    class Meta:
        db_table = "tracking_sessions"
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["tenant", "started_at"]),
            models.Index(fields=["anonymous_id"]),
        ]

    def __str__(self):
        return f"Session {self.session_key}"


class PageView(models.Model):
    """Individual page view within a session."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="page_views")
    url = models.URLField(max_length=2048)
    title = models.CharField(max_length=512, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tracking_page_views"
        ordering = ["-viewed_at"]

    def __str__(self):
        return self.url


class RawEvent(models.Model):
    """
    Raw behavioral event — the ingestion entry point.
    All events land here first before normalization.
    """

    STATUS_PENDING = "pending"
    STATUS_PROCESSED = "processed"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PROCESSED, "Processed"),
        (STATUS_FAILED, "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="raw_events")
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, blank=True)
    anonymous_id = models.CharField(max_length=128, blank=True, db_index=True)
    customer = models.ForeignKey(
        "crm.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="raw_events"
    )
    event_type = models.CharField(max_length=128, db_index=True)
    event_name = models.CharField(max_length=255)
    properties = models.JSONField(default=dict)
    context = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    error_message = models.TextField(blank=True)
    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "tracking_raw_events"
        ordering = ["-received_at"]
        indexes = [
            models.Index(fields=["tenant", "status"]),
            models.Index(fields=["event_type", "received_at"]),
        ]

    def __str__(self):
        return f"{self.event_name} ({self.event_type})"


class IdentityMap(models.Model):
    """
    Identity resolution — links anonymous IDs to known customers.
    Supports cross-device and cross-session merging.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="identity_maps")
    anonymous_id = models.CharField(max_length=128, db_index=True)
    customer = models.ForeignKey("crm.Customer", on_delete=models.CASCADE, related_name="identity_maps")
    resolved_at = models.DateTimeField(auto_now_add=True)
    resolution_method = models.CharField(
        max_length=50,
        choices=[
            ("login", "Login"),
            ("email_capture", "Email Capture"),
            ("api", "API"),
            ("manual", "Manual"),
        ],
        default="login",
    )

    class Meta:
        db_table = "tracking_identity_maps"
        unique_together = [["tenant", "anonymous_id"]]

    def __str__(self):
        return f"{self.anonymous_id} → {self.customer_id}"
