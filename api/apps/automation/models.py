"""
Automation models: Workflow, WorkflowStep, Trigger, Action, WorkflowExecution.
"""

import uuid
from django.conf import settings
from django.db import models


class Trigger(models.Model):
    TYPE_EVENT = "event"
    TYPE_SCHEDULE = "schedule"
    TYPE_WEBHOOK = "webhook"
    TYPE_SEGMENT_ENTER = "segment_enter"
    TYPE_SEGMENT_EXIT = "segment_exit"
    TYPE_FIELD_CHANGE = "field_change"
    TYPE_MANUAL = "manual"

    TYPE_CHOICES = [
        (TYPE_EVENT, "Event"),
        (TYPE_SCHEDULE, "Schedule"),
        (TYPE_WEBHOOK, "Webhook"),
        (TYPE_SEGMENT_ENTER, "Segment Enter"),
        (TYPE_SEGMENT_EXIT, "Segment Exit"),
        (TYPE_FIELD_CHANGE, "Field Change"),
        (TYPE_MANUAL, "Manual"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="triggers")
    name = models.CharField(max_length=255)
    trigger_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "automation_triggers"

    def __str__(self):
        return f"{self.name} ({self.trigger_type})"


class Action(models.Model):
    TYPE_SEND_EMAIL = "send_email"
    TYPE_SEND_SMS = "send_sms"
    TYPE_UPDATE_CUSTOMER = "update_customer"
    TYPE_ADD_TO_SEGMENT = "add_to_segment"
    TYPE_REMOVE_FROM_SEGMENT = "remove_from_segment"
    TYPE_START_JOURNEY = "start_journey"
    TYPE_CREATE_TASK = "create_task"
    TYPE_WEBHOOK = "webhook"
    TYPE_NOTIFY_USER = "notify_user"

    TYPE_CHOICES = [
        (TYPE_SEND_EMAIL, "Send Email"),
        (TYPE_SEND_SMS, "Send SMS"),
        (TYPE_UPDATE_CUSTOMER, "Update Customer"),
        (TYPE_ADD_TO_SEGMENT, "Add to Segment"),
        (TYPE_REMOVE_FROM_SEGMENT, "Remove from Segment"),
        (TYPE_START_JOURNEY, "Start Journey"),
        (TYPE_CREATE_TASK, "Create Task"),
        (TYPE_WEBHOOK, "Webhook"),
        (TYPE_NOTIFY_USER, "Notify User"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="actions")
    name = models.CharField(max_length=255)
    action_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    config = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "automation_actions"

    def __str__(self):
        return f"{self.name} ({self.action_type})"


class Workflow(models.Model):
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

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="workflows")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    trigger = models.ForeignKey(Trigger, on_delete=models.SET_NULL, null=True, related_name="workflows")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT, db_index=True)
    conditions = models.JSONField(default=dict)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "automation_workflows"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class WorkflowStep(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="steps")
    action = models.ForeignKey(Action, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    delay_seconds = models.PositiveIntegerField(default=0)
    conditions = models.JSONField(default=dict)
    on_success_step = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    on_failure_step = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="++"
    )

    class Meta:
        db_table = "automation_workflow_steps"
        ordering = ["order"]

    def __str__(self):
        return f"{self.workflow.name} / Step {self.order}"


class WorkflowExecution(models.Model):
    STATUS_PENDING = "pending"
    STATUS_RUNNING = "running"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_RUNNING, "Running"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_FAILED, "Failed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name="executions")
    customer = models.ForeignKey(
        "crm.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="workflow_executions"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    current_step = models.ForeignKey(WorkflowStep, on_delete=models.SET_NULL, null=True, blank=True)
    trigger_data = models.JSONField(default=dict)
    execution_log = models.JSONField(default=list)
    error_message = models.TextField(blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "automation_workflow_executions"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["workflow", "status"])]

    def __str__(self):
        return f"{self.workflow.name} execution ({self.status})"
