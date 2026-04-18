from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("sessions", views.SessionViewSet, basename="tracking-sessions")
router.register("events", views.RawEventViewSet, basename="tracking-events")
router.register("identity", views.IdentityMapViewSet, basename="tracking-identity")

urlpatterns = [
    path("ingest/", views.EventIngestView.as_view({"post": "create"}), name="tracking-ingest"),
    path("", include(router.urls)),
]
