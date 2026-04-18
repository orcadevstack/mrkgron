from rest_framework import serializers
from .models import Segment, SegmentRule, SegmentMembership


class SegmentRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SegmentRule
        fields = ["id", "field", "operator", "value", "logical_operator", "order"]
        read_only_fields = ["id"]


class SegmentSerializer(serializers.ModelSerializer):
    rules = SegmentRuleSerializer(many=True, read_only=True)

    class Meta:
        model = Segment
        fields = ["id", "name", "description", "segment_type", "filter_conditions", "rules", "member_count", "auto_refresh", "last_refreshed_at", "created_by", "created_at", "updated_at"]
        read_only_fields = ["id", "member_count", "last_refreshed_at", "created_by", "created_at", "updated_at"]


class SegmentMembershipSerializer(serializers.ModelSerializer):
    customer_email = serializers.CharField(source="customer.email", read_only=True)

    class Meta:
        model = SegmentMembership
        fields = ["id", "customer", "customer_email", "added_at", "added_via"]
        read_only_fields = fields
