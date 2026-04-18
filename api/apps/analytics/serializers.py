from rest_framework import serializers
from .models import Event, Metric, Dashboard, Widget, Report, ForecastModel


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "customer", "anonymous_id", "session_id", "event_name", "category", "properties", "context", "url", "referrer", "occurred_at", "ingested_at"]
        read_only_fields = ["id", "ingested_at"]


class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metric
        fields = ["id", "name", "description", "event_name", "aggregation", "field", "period", "filters", "value", "period_start", "period_end", "computed_at"]
        read_only_fields = ["id", "value", "computed_at"]


class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = ["id", "title", "widget_type", "config", "position_x", "position_y", "width", "height", "created_at"]
        read_only_fields = ["id", "created_at"]


class DashboardSerializer(serializers.ModelSerializer):
    widgets = WidgetSerializer(many=True, read_only=True)

    class Meta:
        model = Dashboard
        fields = ["id", "name", "description", "is_default", "layout", "widgets", "created_by", "created_at", "updated_at"]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ["id", "name", "description", "query_config", "status", "result_data", "result_file", "error_message", "scheduled", "schedule_config", "created_by", "created_at", "completed_at"]
        read_only_fields = ["id", "status", "result_data", "result_file", "error_message", "created_by", "created_at", "completed_at"]


class ForecastModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastModel
        fields = ["id", "name", "model_type", "config", "last_trained_at", "accuracy_score", "predictions", "is_active", "created_at"]
        read_only_fields = ["id", "last_trained_at", "accuracy_score", "predictions", "created_at"]
