from django.contrib import admin
from .models import IdentityProfile, IdentityAlias, MergeEvent


class IdentityAliasInline(admin.TabularInline):
    model = IdentityAlias
    extra = 0
    readonly_fields = ["alias_type", "alias_value", "source", "confidence", "created_at"]


@admin.register(IdentityProfile)
class IdentityProfileAdmin(admin.ModelAdmin):
    list_display = ["primary_email", "primary_phone", "is_anonymous", "created_at"]
    list_filter = ["is_anonymous"]
    search_fields = ["primary_email", "primary_phone"]
    inlines = [IdentityAliasInline]


@admin.register(MergeEvent)
class MergeEventAdmin(admin.ModelAdmin):
    list_display = ["source_profile_id", "target_profile", "merged_by", "reason", "merged_at"]
    readonly_fields = ["source_profile_id", "target_profile", "merged_by", "reason", "metadata", "merged_at"]
