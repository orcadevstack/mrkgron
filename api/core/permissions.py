"""
Custom DRF permissions.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTenantMember(BasePermission):
    """Allow access only to members of the request tenant."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        tenant = getattr(request, "tenant", None)
        if tenant is None:
            return False
        return request.user.tenant_memberships.filter(tenant=tenant, is_active=True).exists()


class IsTenantAdmin(BasePermission):
    """Allow access only to tenant administrators."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        tenant = getattr(request, "tenant", None)
        if tenant is None:
            return False
        return request.user.tenant_memberships.filter(
            tenant=tenant, role__in=["admin", "owner"], is_active=True
        ).exists()


class IsOwnerOrReadOnly(BasePermission):
    """Object-level: allow write only to the object owner."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        owner_field = getattr(obj, "created_by", None) or getattr(obj, "owner", None)
        return owner_field == request.user


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS
