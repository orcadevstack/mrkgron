from django.contrib import admin
from .models import Insight, InsightRule


@admin.register(InsightRule)
class InsightRuleAdmin(admin.ModelAdmin):
    list_display = ["name", "trigger_type", "metric_key", "is_active", "created_at"]
    list_filter = ["trigger_type", "is_active"]


@admin.register(Insight)
class InsightAdmin(admin.ModelAdmin):
    list_display = ["title", "insight_type", "priority", "is_read", "is_dismissed", "generated_at"]
    list_filter = ["insight_type", "priority", "is_read", "is_dismissed"]
    readonly_fields = ["id", "generated_at"]
