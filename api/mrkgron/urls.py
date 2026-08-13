"""
Mrkgron URL Configuration
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

api_v1_patterns = [
    path("auth/", include("apps.authentication.urls")),
    path("tenants/", include("apps.tenants.urls")),
    path("crm/", include("apps.crm.urls")),
    path("communications/", include("apps.communications.urls")),
    path("messaging/", include("apps.messaging.urls")),
    path("segments/", include("apps.segments.urls")),
    path("journeys/", include("apps.journeys.urls")),
    path("analytics/", include("apps.analytics.urls")),
    path("commerce/", include("apps.commerce.urls")),
    path("automation/", include("apps.automation.urls")),
    # New modules
    path("tracking/", include("apps.tracking.urls")),
    path("insights/", include("apps.insights.urls")),
    path("storefront/", include("apps.storefront.urls")),
    path("logistics/", include("apps.logistics.urls")),
    path("merchandising/", include("apps.merchandising.urls")),
    path("integrations/", include("apps.integrations.urls")),
    path("identity/", include("apps.identity.urls")),
    # OpenAPI schema
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    path("health/", include("health_check.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
