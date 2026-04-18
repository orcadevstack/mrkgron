from rest_framework.routers import DefaultRouter
from .views import IntegrationViewSet, WebhookEndpointViewSet, APIKeyViewSet

router = DefaultRouter()
router.register("integrations", IntegrationViewSet, basename="integration")
router.register("webhooks", WebhookEndpointViewSet, basename="webhook")
router.register("api-keys", APIKeyViewSet, basename="api-key")

urlpatterns = router.urls
