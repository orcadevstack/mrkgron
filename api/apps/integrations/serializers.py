import hashlib
import secrets
from rest_framework import serializers
from .models import Integration, WebhookEndpoint, WebhookDelivery, APIKey, IntegrationLog


class IntegrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Integration
        fields = [
            "id", "name", "provider", "status", "config",
            "last_synced_at", "error_message", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "status", "last_synced_at", "error_message", "created_at", "updated_at"]


class WebhookEndpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookEndpoint
        fields = [
            "id", "url", "description", "event_types", "is_active", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class WebhookDeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookDelivery
        fields = [
            "id", "event_type", "response_status", "is_success",
            "attempt_count", "delivered_at",
        ]
        read_only_fields = fields


class APIKeySerializer(serializers.ModelSerializer):
    raw_key = serializers.SerializerMethodField()

    class Meta:
        model = APIKey
        fields = [
            "id", "name", "scope", "allowed_ips", "is_active",
            "last_used_at", "expires_at", "created_at", "raw_key",
        ]
        read_only_fields = ["id", "last_used_at", "created_at", "raw_key"]

    def get_raw_key(self, obj):
        # Only returned once on creation, stored in context
        return self.context.get("raw_key")


class APIKeyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ["name", "scope", "allowed_ips", "expires_at"]

    def create(self, validated_data):
        raw_key = secrets.token_urlsafe(40)
        key_prefix = raw_key[:8]
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        instance = APIKey.objects.create(
            **validated_data,
            key_prefix=key_prefix,
            key_hash=key_hash,
        )
        instance._raw_key = raw_key
        return instance


class IntegrationLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrationLog
        fields = ["id", "action", "status", "message", "details", "created_at"]
        read_only_fields = fields
