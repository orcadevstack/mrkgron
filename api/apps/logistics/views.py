from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Carrier, FulfillmentCenter, ShippingZone, ShipmentTracking
from .serializers import (
    CarrierSerializer, FulfillmentCenterSerializer,
    ShippingZoneSerializer, ShipmentTrackingSerializer,
)


class CarrierViewSet(viewsets.ModelViewSet):
    serializer_class = CarrierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Carrier.objects.all()
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class FulfillmentCenterViewSet(viewsets.ModelViewSet):
    serializer_class = FulfillmentCenterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = FulfillmentCenter.objects.all()
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class ShippingZoneViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingZoneSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = ShippingZone.objects.prefetch_related("rates__carrier")
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class ShipmentTrackingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ShipmentTrackingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = ShipmentTracking.objects.select_related("carrier")
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        shipment_id = self.request.query_params.get("shipment_id")
        if shipment_id:
            qs = qs.filter(shipment_id=shipment_id)
        return qs
