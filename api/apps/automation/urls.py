from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("triggers", views.TriggerViewSet, basename="triggers")
router.register("actions", views.ActionViewSet, basename="actions")
router.register("workflows", views.WorkflowViewSet, basename="workflows")
router.register("executions", views.WorkflowExecutionViewSet, basename="workflow-executions")

urlpatterns = [path("", include(router.urls))]
