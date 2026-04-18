from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("threads", views.ThreadViewSet, basename="threads")

urlpatterns = [path("", include(router.urls))]
