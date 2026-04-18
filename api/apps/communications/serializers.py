from rest_framework import serializers
from .models import Channel, MessageTemplate, Campaign, DeliveryLog, EngagementMetric


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ["id", "name", "channel_type", "config", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]


class MessageTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageTemplate
        fields = ["id", "name", "channel_type", "subject", "body", "html_body", "variables", "status", "created_by", "created_at", "updated_at"]
        read_only_fields = ["id", "created_by", "created_at", "updated_at"]


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ["id", "name", "description", "channel", "template", "segment", "status", "scheduled_at", "started_at", "completed_at", "ab_test_enabled", "ab_test_config", "utm_params", "created_by", "created_at", "updated_at"]
        read_only_fields = ["id", "created_by", "started_at", "completed_at", "created_at", "updated_at"]


class DeliveryLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryLog
        fields = ["id", "campaign", "customer", "channel_type", "recipient", "status", "provider_message_id", "error_message", "sent_at", "delivered_at", "created_at"]
        read_only_fields = fields


class EngagementMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = EngagementMetric
        fields = ["id", "delivery_log", "event_type", "url_clicked", "metadata", "occurred_at"]
        read_only_fields = fields
