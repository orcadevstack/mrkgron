from rest_framework import serializers
from .models import Tenant, TenantMembership, TenantInvitation


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ["id", "name", "slug", "domain", "plan", "is_active", "logo", "settings", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class TenantMembershipSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_full_name = serializers.CharField(source="user.full_name", read_only=True)
    tenant_name = serializers.CharField(source="tenant.name", read_only=True)

    class Meta:
        model = TenantMembership
        fields = ["id", "tenant", "tenant_name", "user", "user_email", "user_full_name", "role", "is_active", "joined_at"]
        read_only_fields = ["id", "joined_at"]


class TenantInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantInvitation
        fields = ["id", "email", "role", "status", "expires_at", "created_at"]
        read_only_fields = ["id", "token", "status", "created_at"]
