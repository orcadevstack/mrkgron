from django.contrib import admin
from .models import Journey, JourneyStep, JourneyEnrollment


@admin.register(Journey)
class JourneyAdmin(admin.ModelAdmin):
    list_display = ["name", "status", "trigger_type", "created_at"]
    list_filter = ["status", "trigger_type"]
    search_fields = ["name"]


@admin.register(JourneyStep)
class JourneyStepAdmin(admin.ModelAdmin):
    list_display = ["journey", "step_type", "name", "order"]
    list_filter = ["step_type"]


@admin.register(JourneyEnrollment)
class JourneyEnrollmentAdmin(admin.ModelAdmin):
    list_display = ["customer", "journey", "status", "enrolled_at", "completed_at"]
    list_filter = ["status"]
