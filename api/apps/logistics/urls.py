from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("carriers", views.CarrierViewSet, basename="carriers")
router.register("fulfillment-centers", views.FulfillmentCenterViewSet, basename="fulfillment-centers")
router.register("zones", views.ShippingZoneViewSet, basename="shipping-zones")
router.register("tracking", views.ShipmentTrackingViewSet, basename="shipment-tracking")

urlpatterns = [path("", include(router.urls))]
