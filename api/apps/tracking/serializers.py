from rest_framework import serializers
from .models import Session, PageView, RawEvent, IdentityMap


class PageViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageView
        fields = ["id", "url", "title", "duration_seconds", "viewed_at"]
        read_only_fields = fields


class SessionSerializer(serializers.ModelSerializer):
    page_views = PageViewSerializer(many=True, read_only=True)

    class Meta:
        model = Session
        fields = [
            "id", "session_key", "anonymous_id", "customer", "ip_address",
            "utm_source", "utm_medium", "utm_campaign", "is_identified",
            "started_at", "last_seen_at", "page_views",
        ]
        read_only_fields = ["id", "started_at", "last_seen_at"]


class RawEventIngestSerializer(serializers.Serializer):
    """Public ingest endpoint — accepts events from JS SDK."""
    event_type = serializers.CharField(max_length=128)
    event_name = serializers.CharField(max_length=255)
    anonymous_id = serializers.CharField(max_length=128, required=False, default="")
    properties = serializers.JSONField(default=dict)
    context = serializers.JSONField(default=dict)


class RawEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawEvent
        fields = ["id", "event_type", "event_name", "properties", "status", "received_at"]
        read_only_fields = fields


class IdentityMapSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdentityMap
        fields = ["id", "anonymous_id", "customer", "resolved_at", "resolution_method"]
        read_only_fields = ["id", "resolved_at"]
