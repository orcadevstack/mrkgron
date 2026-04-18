from django.contrib import admin
from .models import Trigger, Action, Workflow, WorkflowStep, WorkflowExecution


@admin.register(Trigger)
class TriggerAdmin(admin.ModelAdmin):
    list_display = ["name", "trigger_type", "is_active", "created_at"]
    list_filter = ["trigger_type", "is_active"]


@admin.register(Action)
class ActionAdmin(admin.ModelAdmin):
    list_display = ["name", "action_type", "created_at"]
    list_filter = ["action_type"]


@admin.register(Workflow)
class WorkflowAdmin(admin.ModelAdmin):
    list_display = ["name", "status", "trigger", "created_by", "created_at"]
    list_filter = ["status"]
    search_fields = ["name"]


@admin.register(WorkflowExecution)
class WorkflowExecutionAdmin(admin.ModelAdmin):
    list_display = ["workflow", "customer", "status", "started_at", "completed_at"]
    list_filter = ["status"]
    readonly_fields = ["id", "execution_log", "trigger_data", "created_at"]
