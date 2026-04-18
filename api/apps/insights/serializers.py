from rest_framework import serializers
from .models import Insight, InsightRule


class InsightRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsightRule
        fields = [
            "id", "name", "description", "trigger_type", "metric_key",
            "threshold_value", "query_config", "is_active", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Insight
        fields = [
            "id", "rule", "insight_type", "priority", "title", "summary",
            "data_points", "recommendation", "is_read", "is_dismissed",
            "generated_at", "expires_at",
        ]
        read_only_fields = ["id", "generated_at"]
