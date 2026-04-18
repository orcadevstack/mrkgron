"""
Messaging models: Message, Thread, Attachment.
"""

import uuid
from django.conf import settings
from django.db import models


class Thread(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="threads")
    customer = models.ForeignKey("crm.Customer", on_delete=models.CASCADE, related_name="threads")
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_threads"
    )
    subject = models.CharField(max_length=500, blank=True)
    channel_type = models.CharField(max_length=30, default="email")
    is_open = models.BooleanField(default=True)
    last_message_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messaging_threads"
        ordering = ["-last_message_at"]

    def __str__(self):
        return f"Thread #{self.id} — {self.customer}"


class Message(models.Model):
    DIRECTION_INBOUND = "inbound"
    DIRECTION_OUTBOUND = "outbound"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="messages")
    sender_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    direction = models.CharField(max_length=10, choices=[(DIRECTION_INBOUND, "Inbound"), (DIRECTION_OUTBOUND, "Outbound")])
    body = models.TextField()
    html_body = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messaging_messages"
        ordering = ["created_at"]

    def __str__(self):
        return f"Message in {self.thread} ({self.direction})"


class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="messaging/attachments/")
    filename = models.CharField(max_length=500)
    content_type = models.CharField(max_length=200, blank=True)
    size_bytes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "messaging_attachments"

    def __str__(self):
        return self.filename
