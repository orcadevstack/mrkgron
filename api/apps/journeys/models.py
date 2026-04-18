"""
Journeys models: Journey, JourneyStep, JourneyEnrollment.
"""

import uuid
from django.conf import settings
from django.db import models


class Journey(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_ACTIVE = "active"
    STATUS_PAUSED = "paused"
    STATUS_ARCHIVED = "archived"

    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_PAUSED, "Paused"),
        (STATUS_ARCHIVED, "Archived"),
    ]

    TRIGGER_EVENT = "event"
    TRIGGER_SEGMENT = "segment_join"
    TRIGGER_MANUAL = "manual"
    TRIGGER_SCHEDULE = "schedule"

    TRIGGER_CHOICES = [
        (TRIGGER_EVENT, "Event"),
        (TRIGGER_SEGMENT, "Segment Join"),
        (TRIGGER_MANUAL, "Manual"),
        (TRIGGER_SCHEDULE, "Schedule"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="journeys")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT, db_index=True)
    trigger_type = models.CharField(max_length=30, choices=TRIGGER_CHOICES, default=TRIGGER_MANUAL)
    trigger_config = models.JSONField(default=dict)
    goal_config = models.JSONField(default=dict)
    allow_re_entry = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "journeys"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class JourneyStep(models.Model):
    TYPE_WAIT = "wait"
    TYPE_SEND_EMAIL = "send_email"
    TYPE_SEND_SMS = "send_sms"
    TYPE_CONDITION = "condition"
    TYPE_UPDATE_FIELD = "update_field"
    TYPE_WEBHOOK = "webhook"
    TYPE_END = "end"

    TYPE_CHOICES = [
        (TYPE_WAIT, "Wait"),
        (TYPE_SEND_EMAIL, "Send Email"),
        (TYPE_SEND_SMS, "Send SMS"),
        (TYPE_CONDITION, "Condition"),
        (TYPE_UPDATE_FIELD, "Update Field"),
        (TYPE_WEBHOOK, "Webhook"),
        (TYPE_END, "End"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name="steps")
    step_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    name = models.CharField(max_length=255, blank=True)
    config = models.JSONField(default=dict)
    order = models.PositiveIntegerField(default=0)
    next_step_on_success = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="previous_steps"
    )
    next_step_on_failure = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="failure_previous_steps"
    )
    position_x = models.FloatField(default=0)
    position_y = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "journey_steps"
        ordering = ["order"]

    def __str__(self):
        return f"{self.journey.name} / {self.step_type} ({self.order})"


class JourneyEnrollment(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_COMPLETED = "completed"
    STATUS_EXITED = "exited"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_EXITED, "Exited"),
        (STATUS_FAILED, "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, related_name="enrollments")
    customer = models.ForeignKey("crm.Customer", on_delete=models.CASCADE, related_name="journey_enrollments")
    current_step = models.ForeignKey(JourneyStep, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE, db_index=True)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    metadata = models.JSONField(default=dict)

    class Meta:
        db_table = "journey_enrollments"
        ordering = ["-enrolled_at"]
        indexes = [models.Index(fields=["journey", "status"])]

    def __str__(self):
        return f"{self.customer} in {self.journey}"
