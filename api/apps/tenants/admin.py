from django.contrib import admin
from .models import Tenant, TenantMembership, TenantInvitation


@admin.register(Tenant)
class TenantAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "plan", "is_active", "created_at"]
    list_filter = ["plan", "is_active"]
    search_fields = ["name", "slug", "domain"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(TenantMembership)
class TenantMembershipAdmin(admin.ModelAdmin):
    list_display = ["user", "tenant", "role", "is_active", "joined_at"]
    list_filter = ["role", "is_active"]
    search_fields = ["user__email", "tenant__name"]


@admin.register(TenantInvitation)
class TenantInvitationAdmin(admin.ModelAdmin):
    list_display = ["email", "tenant", "role", "status", "expires_at"]
    list_filter = ["status", "role"]
    search_fields = ["email", "tenant__name"]
