from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("stores", views.StoreViewSet, basename="stores")
router.register("pages", views.StorePageViewSet, basename="storefront-pages")

urlpatterns = [path("", include(router.urls))]
