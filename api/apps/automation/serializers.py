from rest_framework import serializers
from .models import Trigger, Action, Workflow, WorkflowStep, WorkflowExecution


class TriggerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trigger
        fields = ["id", "name", "trigger_type", "config", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]


class ActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Action
        fields = ["id", "name", "action_type", "config", "created_at"]
        read_only_fields = ["id", "created_at"]


class WorkflowStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStep
        fields = ["id", "action", "order", "delay_seconds", "conditions", "on_success_step", "on_failure_step"]
        read_only_fields = ["id"]


class WorkflowSerializer(serializers.ModelSerializer):
    steps = WorkflowStepSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = ["id", "name", "description", "trigger", "status", "conditions", "steps", "created_by", "created_at", "updated_at"]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]


class WorkflowExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowExecution
        fields = ["id", "workflow", "customer", "status", "trigger_data", "execution_log", "error_message", "started_at", "completed_at", "created_at"]
        read_only_fields = fields
