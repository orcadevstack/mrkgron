from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("channels", views.ChannelViewSet, basename="channels")
router.register("templates", views.MessageTemplateViewSet, basename="message-templates")
router.register("campaigns", views.CampaignViewSet, basename="campaigns")
router.register("delivery-logs", views.DeliveryLogViewSet, basename="delivery-logs")

urlpatterns = [
    path("", include(router.urls)),
]
