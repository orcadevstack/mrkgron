from rest_framework import serializers
from .models import Carrier, FulfillmentCenter, ShippingZone, ShippingRate, ShipmentTracking


class CarrierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrier
        fields = ["id", "name", "code", "tracking_url_template", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]


class FulfillmentCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = FulfillmentCenter
        fields = ["id", "name", "code", "address", "is_active", "is_default", "created_at"]
        read_only_fields = ["id", "created_at"]


class ShippingRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingRate
        fields = [
            "id", "carrier", "name", "rate_type", "amount",
            "min_order_value", "max_order_value",
            "estimated_days_min", "estimated_days_max", "is_active",
        ]
        read_only_fields = ["id"]


class ShippingZoneSerializer(serializers.ModelSerializer):
    rates = ShippingRateSerializer(many=True, read_only=True)

    class Meta:
        model = ShippingZone
        fields = ["id", "name", "countries", "states", "zip_codes", "is_active", "rates", "created_at"]
        read_only_fields = ["id", "created_at"]


class ShipmentTrackingSerializer(serializers.ModelSerializer):
    tracking_url = serializers.SerializerMethodField()

    class Meta:
        model = ShipmentTracking
        fields = [
            "id", "shipment_id", "carrier", "tracking_number", "status",
            "events", "estimated_delivery", "delivered_at",
            "tracking_url", "created_at", "updated_at",
        ]
        read_only_fields = fields

    def get_tracking_url(self, obj):
        if obj.carrier:
            return obj.carrier.tracking_url(obj.tracking_number)
        return None
