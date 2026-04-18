from rest_framework import serializers
from .models import Journey, JourneyStep, JourneyEnrollment


class JourneyStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyStep
        fields = ["id", "step_type", "name", "config", "order", "next_step_on_success", "next_step_on_failure", "position_x", "position_y"]
        read_only_fields = ["id"]


class JourneySerializer(serializers.ModelSerializer):
    steps = JourneyStepSerializer(many=True, read_only=True)

    class Meta:
        model = Journey
        fields = ["id", "name", "description", "status", "trigger_type", "trigger_config", "goal_config", "allow_re_entry", "steps", "created_by", "created_at", "updated_at"]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]


class JourneyEnrollmentSerializer(serializers.ModelSerializer):
    customer_email = serializers.CharField(source="customer.email", read_only=True)

    class Meta:
        model = JourneyEnrollment
        fields = ["id", "journey", "customer", "customer_email", "current_step", "status", "enrolled_at", "completed_at"]
        read_only_fields = ["id", "enrolled_at", "completed_at"]
