from django.contrib import admin
from .models import Customer, CustomerProfile, Interaction, Preference, Score, LifecycleStage


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["email", "full_name", "company", "status", "tenant", "created_at"]
    list_filter = ["status", "opted_in_email", "opted_in_sms"]
    search_fields = ["email", "first_name", "last_name", "company"]
    ordering = ["-created_at"]


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ["customer", "timezone", "language"]
    search_fields = ["customer__email"]


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = ["customer", "interaction_type", "direction", "performed_by", "occurred_at"]
    list_filter = ["interaction_type", "direction"]
    search_fields = ["customer__email", "subject"]


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ["customer", "engagement_score", "lead_score", "churn_risk_score", "lifetime_value"]
    search_fields = ["customer__email"]


@admin.register(LifecycleStage)
class LifecycleStageAdmin(admin.ModelAdmin):
    list_display = ["customer", "stage", "is_current", "entered_at"]
    list_filter = ["stage", "is_current"]
