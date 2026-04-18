from django.contrib import admin
from .models import Segment, SegmentRule, SegmentMembership


@admin.register(Segment)
class SegmentAdmin(admin.ModelAdmin):
    list_display = ["name", "segment_type", "member_count", "auto_refresh", "last_refreshed_at"]
    list_filter = ["segment_type", "auto_refresh"]
    search_fields = ["name"]


@admin.register(SegmentRule)
class SegmentRuleAdmin(admin.ModelAdmin):
    list_display = ["segment", "field", "operator", "logical_operator", "order"]
