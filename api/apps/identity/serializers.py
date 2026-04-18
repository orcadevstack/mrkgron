from rest_framework import serializers
from .models import IdentityProfile, IdentityAlias, MergeEvent


class IdentityAliasSerializer(serializers.ModelSerializer):
    class Meta:
        model = IdentityAlias
        fields = ["id", "alias_type", "alias_value", "source", "confidence", "created_at"]
        read_only_fields = ["id", "created_at"]


class IdentityProfileSerializer(serializers.ModelSerializer):
    aliases = IdentityAliasSerializer(many=True, read_only=True)

    class Meta:
        model = IdentityProfile
        fields = [
            "id", "customer", "primary_email", "primary_phone",
            "traits", "is_anonymous", "aliases", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "is_anonymous", "aliases", "created_at", "updated_at"]


class MergeEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = MergeEvent
        fields = [
            "id", "source_profile_id", "target_profile", "merged_by",
            "reason", "metadata", "merged_at",
        ]
        read_only_fields = fields


class MergeRequestSerializer(serializers.Serializer):
    source_profile_id = serializers.UUIDField()
    target_profile_id = serializers.UUIDField()
    reason = serializers.CharField(required=False, default="")
