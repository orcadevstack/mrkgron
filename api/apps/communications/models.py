"""
Communications models: Channel, MessageTemplate, Campaign, DeliveryLog, EngagementMetric.
"""

import uuid
from django.conf import settings
from django.db import models


class Channel(models.Model):
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WHATSAPP = "whatsapp"
    IN_APP = "in_app"
    WEBHOOK = "webhook"

    CHANNEL_CHOICES = [
        (EMAIL, "Email"),
        (SMS, "SMS"),
        (PUSH, "Push Notification"),
        (WHATSAPP, "WhatsApp"),
        (IN_APP, "In-App"),
        (WEBHOOK, "Webhook"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="channels")
    name = models.CharField(max_length=100)
    channel_type = models.CharField(max_length=30, choices=CHANNEL_CHOICES)
    config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comm_channels"
        unique_together = [["tenant", "channel_type", "name"]]

    def __str__(self):
        return f"{self.name} ({self.channel_type})"


class MessageTemplate(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_ACTIVE = "active"
    STATUS_ARCHIVED = "archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="message_templates")
    name = models.CharField(max_length=255)
    channel_type = models.CharField(max_length=30, choices=Channel.CHANNEL_CHOICES)
    subject = models.CharField(max_length=500, blank=True)
    body = models.TextField()
    html_body = models.TextField(blank=True)
    variables = models.JSONField(default=list)
    status = models.CharField(max_length=20, default=STATUS_DRAFT)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_templates"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "comm_message_templates"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Campaign(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_SCHEDULED = "scheduled"
    STATUS_RUNNING = "running"
    STATUS_PAUSED = "paused"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_SCHEDULED, "Scheduled"),
        (STATUS_RUNNING, "Running"),
        (STATUS_PAUSED, "Paused"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="campaigns")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    channel = models.ForeignKey(Channel, on_delete=models.SET_NULL, null=True)
    template = models.ForeignKey(MessageTemplate, on_delete=models.SET_NULL, null=True)
    segment = models.ForeignKey("segments.Segment", on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT, db_index=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    ab_test_enabled = models.BooleanField(default=False)
    ab_test_config = models.JSONField(default=dict)
    utm_params = models.JSONField(default=dict)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_campaigns"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "comm_campaigns"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["tenant", "status"])]

    def __str__(self):
        return self.name


class DeliveryLog(models.Model):
    STATUS_PENDING = "pending"
    STATUS_SENT = "sent"
    STATUS_DELIVERED = "delivered"
    STATUS_FAILED = "failed"
    STATUS_BOUNCED = "bounced"
    STATUS_UNSUBSCRIBED = "unsubscribed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SENT, "Sent"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_FAILED, "Failed"),
        (STATUS_BOUNCED, "Bounced"),
        (STATUS_UNSUBSCRIBED, "Unsubscribed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="delivery_logs", null=True, blank=True)
    customer = models.ForeignKey("crm.Customer", on_delete=models.CASCADE, related_name="delivery_logs")
    channel_type = models.CharField(max_length=30, choices=Channel.CHANNEL_CHOICES)
    recipient = models.CharField(max_length=500)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    provider_message_id = models.CharField(max_length=500, blank=True)
    error_message = models.TextField(blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comm_delivery_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["campaign", "status"]),
            models.Index(fields=["customer", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.recipient} — {self.status}"


class EngagementMetric(models.Model):
    EVENT_OPEN = "open"
    EVENT_CLICK = "click"
    EVENT_REPLY = "reply"
    EVENT_UNSUBSCRIBE = "unsubscribe"
    EVENT_BOUNCE = "bounce"
    EVENT_SPAM = "spam"
    EVENT_CONVERSION = "conversion"

    EVENT_CHOICES = [
        (EVENT_OPEN, "Open"),
        (EVENT_CLICK, "Click"),
        (EVENT_REPLY, "Reply"),
        (EVENT_UNSUBSCRIBE, "Unsubscribe"),
        (EVENT_BOUNCE, "Bounce"),
        (EVENT_SPAM, "Spam Report"),
        (EVENT_CONVERSION, "Conversion"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery_log = models.ForeignKey(DeliveryLog, on_delete=models.CASCADE, related_name="engagement_metrics")
    event_type = models.CharField(max_length=30, choices=EVENT_CHOICES, db_index=True)
    url_clicked = models.URLField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "comm_engagement_metrics"
        ordering = ["-occurred_at"]

    def __str__(self):
        return f"{self.event_type} on {self.delivery_log}"
