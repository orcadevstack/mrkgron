from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, Role, AuditLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "first_name", "last_name", "is_active", "is_staff", "date_joined"]
    list_filter = ["is_active", "is_staff", "is_superuser"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["-date_joined"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "phone", "avatar")}),
        ("Preferences", {"fields": ("timezone", "language", "two_factor_enabled")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("date_joined", "last_login")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "company", "job_title"]
    search_fields = ["user__email", "company"]


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "created_at"]


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["user", "action", "resource_type", "resource_id", "created_at"]
    list_filter = ["resource_type"]
    search_fields = ["user__email", "action"]
    readonly_fields = ["id", "user", "action", "resource_type", "resource_id", "ip_address", "created_at"]
