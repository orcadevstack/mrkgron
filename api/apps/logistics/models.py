"""
Logistics models — carriers, shipping zones, rates, fulfillment centers, and shipment tracking.
"""

import uuid
from django.db import models


class Carrier(models.Model):
    """Shipping carrier (FedEx, UPS, USPS, DHL, etc.)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="carriers")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    tracking_url_template = models.URLField(
        blank=True,
        help_text="Use {tracking_number} as placeholder, e.g. https://track.ups.com/?tracknum={tracking_number}",
    )
    is_active = models.BooleanField(default=True)
    config = models.JSONField(default=dict, help_text="API credentials and options")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "logistics_carriers"
        unique_together = [["tenant", "code"]]

    def __str__(self):
        return self.name

    def tracking_url(self, tracking_number: str) -> str:
        if self.tracking_url_template and tracking_number:
            return self.tracking_url_template.replace("{tracking_number}", tracking_number)
        return ""


class FulfillmentCenter(models.Model):
    """Physical warehouse / fulfillment location."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="fulfillment_centers")
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    address = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "logistics_fulfillment_centers"

    def __str__(self):
        return self.name


class ShippingZone(models.Model):
    """Geographic shipping zone."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="shipping_zones")
    name = models.CharField(max_length=255)
    countries = models.JSONField(default=list, help_text="ISO 3166-1 alpha-2 country codes")
    states = models.JSONField(default=list, help_text="State/province codes")
    zip_codes = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "logistics_shipping_zones"

    def __str__(self):
        return self.name


class ShippingRate(models.Model):
    """Rate within a shipping zone."""

    RATE_FLAT = "flat"
    RATE_WEIGHT = "weight"
    RATE_ORDER_VALUE = "order_value"
    RATE_PER_ITEM = "per_item"
    RATE_FREE = "free"

    RATE_TYPE_CHOICES = [
        (RATE_FLAT, "Flat Rate"),
        (RATE_WEIGHT, "Weight-Based"),
        (RATE_ORDER_VALUE, "Order Value Based"),
        (RATE_PER_ITEM, "Per Item"),
        (RATE_FREE, "Free Shipping"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    zone = models.ForeignKey(ShippingZone, on_delete=models.CASCADE, related_name="rates")
    carrier = models.ForeignKey(Carrier, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    rate_type = models.CharField(max_length=20, choices=RATE_TYPE_CHOICES, default=RATE_FLAT)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_order_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    min_weight = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    max_weight = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    estimated_days_min = models.PositiveSmallIntegerField(default=1)
    estimated_days_max = models.PositiveSmallIntegerField(default=7)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "logistics_shipping_rates"

    def __str__(self):
        return f"{self.name} ({self.zone.name})"


class ShipmentTracking(models.Model):
    """
    Extends the commerce.Shipment with detailed tracking events.
    Links to commerce.Shipment by reference rather than FK to avoid circular deps.
    """

    STATUS_PRE_TRANSIT = "pre_transit"
    STATUS_IN_TRANSIT = "in_transit"
    STATUS_OUT_FOR_DELIVERY = "out_for_delivery"
    STATUS_DELIVERED = "delivered"
    STATUS_FAILED = "failed"
    STATUS_RETURNED = "returned"

    STATUS_CHOICES = [
        (STATUS_PRE_TRANSIT, "Pre-Transit"),
        (STATUS_IN_TRANSIT, "In Transit"),
        (STATUS_OUT_FOR_DELIVERY, "Out for Delivery"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_FAILED, "Failed Delivery"),
        (STATUS_RETURNED, "Returned"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="shipment_trackings")
    shipment_id = models.UUIDField(db_index=True)
    carrier = models.ForeignKey(Carrier, on_delete=models.SET_NULL, null=True, blank=True)
    fulfillment_center = models.ForeignKey(FulfillmentCenter, on_delete=models.SET_NULL, null=True, blank=True)
    tracking_number = models.CharField(max_length=255, blank=True, db_index=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_PRE_TRANSIT, db_index=True)
    events = models.JSONField(default=list, help_text="List of {timestamp, location, description}")
    estimated_delivery = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "logistics_shipment_trackings"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Tracking {self.tracking_number} ({self.status})"
