from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("events", views.EventViewSet, basename="events")
router.register("metrics", views.MetricViewSet, basename="metrics")
router.register("dashboards", views.DashboardViewSet, basename="dashboards")
router.register("reports", views.ReportViewSet, basename="reports")
router.register("forecasts", views.ForecastModelViewSet, basename="forecasts")
router.register("summary", views.AnalyticsSummaryView, basename="analytics-summary")

urlpatterns = [path("", include(router.urls))]
