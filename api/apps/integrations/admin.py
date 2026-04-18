from django.contrib import admin
from .models import Integration, WebhookEndpoint, WebhookDelivery, APIKey, IntegrationLog


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    list_display = ["name", "provider", "status", "last_synced_at", "created_at"]
    list_filter = ["provider", "status"]
    search_fields = ["name", "provider"]


@admin.register(WebhookEndpoint)
class WebhookEndpointAdmin(admin.ModelAdmin):
    list_display = ["url", "description", "is_active", "created_at"]
    list_filter = ["is_active"]


@admin.register(WebhookDelivery)
class WebhookDeliveryAdmin(admin.ModelAdmin):
    list_display = ["endpoint", "event_type", "response_status", "is_success", "delivered_at"]
    list_filter = ["is_success", "event_type"]
    readonly_fields = ["endpoint", "event_type", "payload", "response_status", "response_body", "is_success", "attempt_count", "delivered_at"]


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ["name", "key_prefix", "scope", "is_active", "last_used_at", "expires_at"]
    list_filter = ["scope", "is_active"]


@admin.register(IntegrationLog)
class IntegrationLogAdmin(admin.ModelAdmin):
    list_display = ["integration", "action", "status", "created_at"]
    list_filter = ["status"]
    readonly_fields = ["integration", "action", "status", "message", "details", "created_at"]
