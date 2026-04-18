from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("", views.TenantViewSet, basename="tenants")
router.register("memberships", views.TenantMembershipViewSet, basename="tenant-memberships")

urlpatterns = [
    path("", include(router.urls)),
    path("invite/", views.InviteMemberView.as_view(), name="tenant-invite"),
    path("accept-invitation/<uuid:token>/", views.AcceptInvitationView.as_view(), name="accept-invitation"),
]
