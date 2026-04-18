from django.contrib import admin
from .models import Event, Metric, Dashboard, Widget, Report, ForecastModel


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ["event_name", "category", "customer", "occurred_at"]
    list_filter = ["category"]
    search_fields = ["event_name", "anonymous_id"]


@admin.register(Metric)
class MetricAdmin(admin.ModelAdmin):
    list_display = ["name", "event_name", "aggregation", "period", "value", "computed_at"]
    list_filter = ["aggregation", "period"]


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ["name", "is_default", "created_by", "created_at"]
    list_filter = ["is_default"]
    search_fields = ["name"]


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ["name", "status", "scheduled", "created_by", "created_at"]
    list_filter = ["status", "scheduled"]


@admin.register(ForecastModel)
class ForecastModelAdmin(admin.ModelAdmin):
    list_display = ["name", "model_type", "accuracy_score", "last_trained_at", "is_active"]
    list_filter = ["model_type", "is_active"]
