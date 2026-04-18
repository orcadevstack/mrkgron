from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("customers", views.CustomerViewSet, basename="customers")
router.register("interactions", views.InteractionViewSet, basename="interactions")
router.register("lifecycle", views.LifecycleStageViewSet, basename="lifecycle")

urlpatterns = [
    path("", include(router.urls)),
]
