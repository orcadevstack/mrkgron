from django.contrib import admin
from .models import Carrier, FulfillmentCenter, ShippingZone, ShippingRate, ShipmentTracking


@admin.register(Carrier)
class CarrierAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active", "created_at"]
    list_filter = ["is_active"]


@admin.register(FulfillmentCenter)
class FulfillmentCenterAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active", "is_default"]


class ShippingRateInline(admin.TabularInline):
    model = ShippingRate
    extra = 1


@admin.register(ShippingZone)
class ShippingZoneAdmin(admin.ModelAdmin):
    list_display = ["name", "is_active", "created_at"]
    inlines = [ShippingRateInline]


@admin.register(ShipmentTracking)
class ShipmentTrackingAdmin(admin.ModelAdmin):
    list_display = ["tracking_number", "carrier", "status", "estimated_delivery", "created_at"]
    list_filter = ["status"]
    readonly_fields = ["id", "created_at", "updated_at"]
