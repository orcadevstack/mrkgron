from django.contrib import admin
from .models import Channel, MessageTemplate, Campaign, DeliveryLog, EngagementMetric


@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ["name", "channel_type", "tenant", "is_active"]
    list_filter = ["channel_type", "is_active"]


@admin.register(MessageTemplate)
class MessageTemplateAdmin(admin.ModelAdmin):
    list_display = ["name", "channel_type", "status", "tenant", "created_at"]
    list_filter = ["channel_type", "status"]
    search_fields = ["name", "subject"]


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ["name", "status", "channel", "scheduled_at", "created_at"]
    list_filter = ["status"]
    search_fields = ["name"]


@admin.register(DeliveryLog)
class DeliveryLogAdmin(admin.ModelAdmin):
    list_display = ["recipient", "channel_type", "status", "sent_at", "created_at"]
    list_filter = ["channel_type", "status"]
    search_fields = ["recipient"]
    readonly_fields = ["id", "created_at"]


@admin.register(EngagementMetric)
class EngagementMetricAdmin(admin.ModelAdmin):
    list_display = ["delivery_log", "event_type", "occurred_at"]
    list_filter = ["event_type"]
