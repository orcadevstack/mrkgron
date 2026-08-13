"""
Integrations models — third-party app connections, webhook endpoints, and API keys.
"""

import uuid
import secrets
from django.conf import settings
from django.db import models


class Integration(models.Model):
    """A configured third-party integration (Zapier, Slack, HubSpot, etc.)."""

    STATUS_CONNECTED = "connected"
    STATUS_DISCONNECTED = "disconnected"
    STATUS_ERROR = "error"
    STATUS_PENDING = "pending"

    STATUS_CHOICES = [
        (STATUS_CONNECTED, "Connected"),
        (STATUS_DISCONNECTED, "Disconnected"),
        (STATUS_ERROR, "Error"),
        (STATUS_PENDING, "Pending"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="integrations")
    name = models.CharField(max_length=255)
    provider = models.CharField(max_length=100, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    credentials = models.JSONField(default=dict, help_text="Encrypted credentials — store only tokens/keys, no raw passwords")
    config = models.JSONField(default=dict)
    last_synced_at = models.DateTimeField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "integrations"
        unique_together = [["tenant", "provider"]]

    def __str__(self):
        return f"{self.name} ({self.provider})"


class WebhookEndpoint(models.Model):
    """Outbound webhook — Mrkgron → external system."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="webhook_endpoints")
    url = models.URLField(max_length=2048)
    description = models.CharField(max_length=255, blank=True)
    event_types = models.JSONField(default=list, help_text="List of event type strings to subscribe to")
    secret = models.CharField(max_length=128, blank=True, help_text="HMAC signing secret")
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "integrations_webhook_endpoints"

    def save(self, *args, **kwargs):
        if not self.secret:
            self.secret = secrets.token_hex(32)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.url


class WebhookDelivery(models.Model):
    """Log of each webhook delivery attempt."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    endpoint = models.ForeignKey(WebhookEndpoint, on_delete=models.CASCADE, related_name="deliveries")
    event_type = models.CharField(max_length=128)
    payload = models.JSONField(default=dict)
    response_status = models.PositiveSmallIntegerField(null=True, blank=True)
    response_body = models.TextField(blank=True)
    is_success = models.BooleanField(default=False)
    attempt_count = models.PositiveSmallIntegerField(default=1)
    delivered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "integrations_webhook_deliveries"
        ordering = ["-delivered_at"]

    def __str__(self):
        return f"{self.event_type} → {self.endpoint.url} ({self.response_status})"


class APIKey(models.Model):
    """Public API key for third-party access to the Mrkgron API."""

    SCOPE_READ = "read"
    SCOPE_WRITE = "write"
    SCOPE_FULL = "full"

    SCOPE_CHOICES = [
        (SCOPE_READ, "Read Only"),
        (SCOPE_WRITE, "Write"),
        (SCOPE_FULL, "Full Access"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="api_keys")
    name = models.CharField(max_length=255)
    key_prefix = models.CharField(max_length=10, db_index=True)
    key_hash = models.CharField(max_length=128)
    scope = models.CharField(max_length=20, choices=SCOPE_CHOICES, default=SCOPE_READ)
    allowed_ips = models.JSONField(default=list, help_text="Empty = allow all IPs")
    is_active = models.BooleanField(default=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "integrations_api_keys"

    def __str__(self):
        return f"{self.name} ({self.key_prefix}…)"


class IntegrationLog(models.Model):
    """Audit log for integration events."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    integration = models.ForeignKey(Integration, on_delete=models.CASCADE, related_name="logs")
    action = models.CharField(max_length=128)
    status = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    details = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "integrations_logs"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.integration.name} — {self.action} ({self.status})"
