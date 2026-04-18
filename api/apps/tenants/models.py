"""
Tenants models: Tenant, TenantMembership, TenantInvitation.
"""

import uuid
from django.conf import settings
from django.db import models


class Tenant(models.Model):
    PLAN_FREE = "free"
    PLAN_STARTER = "starter"
    PLAN_PROFESSIONAL = "professional"
    PLAN_ENTERPRISE = "enterprise"

    PLAN_CHOICES = [
        (PLAN_FREE, "Free"),
        (PLAN_STARTER, "Starter"),
        (PLAN_PROFESSIONAL, "Professional"),
        (PLAN_ENTERPRISE, "Enterprise"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, db_index=True)
    domain = models.CharField(max_length=255, blank=True, db_index=True)
    plan = models.CharField(max_length=30, choices=PLAN_CHOICES, default=PLAN_FREE)
    is_active = models.BooleanField(default=True)
    logo = models.ImageField(upload_to="tenants/logos/", null=True, blank=True)
    settings = models.JSONField(default=dict)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "tenants"
        ordering = ["name"]

    def __str__(self):
        return self.name


class TenantMembership(models.Model):
    ROLE_OWNER = "owner"
    ROLE_ADMIN = "admin"
    ROLE_MANAGER = "manager"
    ROLE_ANALYST = "analyst"
    ROLE_MEMBER = "member"
    ROLE_VIEWER = "viewer"

    ROLE_CHOICES = [
        (ROLE_OWNER, "Owner"),
        (ROLE_ADMIN, "Admin"),
        (ROLE_MANAGER, "Manager"),
        (ROLE_ANALYST, "Analyst"),
        (ROLE_MEMBER, "Member"),
        (ROLE_VIEWER, "Viewer"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="memberships")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tenant_memberships"
    )
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default=ROLE_MEMBER)
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    extra_permissions = models.JSONField(default=list)

    class Meta:
        db_table = "tenant_memberships"
        unique_together = [["tenant", "user"]]
        indexes = [models.Index(fields=["user", "tenant"])]

    def __str__(self):
        return f"{self.user} in {self.tenant} as {self.role}"


class TenantInvitation(models.Model):
    STATUS_PENDING = "pending"
    STATUS_ACCEPTED = "accepted"
    STATUS_EXPIRED = "expired"
    STATUS_REVOKED = "revoked"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_EXPIRED, "Expired"),
        (STATUS_REVOKED, "Revoked"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="invitations")
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="sent_invitations"
    )
    email = models.EmailField()
    role = models.CharField(max_length=30, choices=TenantMembership.ROLE_CHOICES, default=TenantMembership.ROLE_MEMBER)
    token = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "tenant_invitations"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Invitation for {self.email} to {self.tenant}"
