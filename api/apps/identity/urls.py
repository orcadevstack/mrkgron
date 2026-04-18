from rest_framework.routers import DefaultRouter
from .views import IdentityProfileViewSet

router = DefaultRouter()
router.register("profiles", IdentityProfileViewSet, basename="identity-profile")

urlpatterns = router.urls
