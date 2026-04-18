from django.contrib import admin
from .models import Session, PageView, RawEvent, IdentityMap


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ["session_key", "customer", "is_identified", "utm_source", "started_at"]
    list_filter = ["is_identified", "utm_source"]
    search_fields = ["session_key", "anonymous_id"]
    readonly_fields = ["id", "started_at", "last_seen_at"]


@admin.register(RawEvent)
class RawEventAdmin(admin.ModelAdmin):
    list_display = ["event_name", "event_type", "status", "received_at"]
    list_filter = ["status", "event_type"]
    readonly_fields = ["id", "received_at", "processed_at"]


@admin.register(IdentityMap)
class IdentityMapAdmin(admin.ModelAdmin):
    list_display = ["anonymous_id", "customer", "resolution_method", "resolved_at"]
    list_filter = ["resolution_method"]
