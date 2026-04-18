from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("categories", views.CategoryViewSet, basename="categories")
router.register("products", views.ProductViewSet, basename="products")
router.register("inventory", views.InventoryViewSet, basename="inventory")
router.register("carts", views.CartViewSet, basename="carts")
router.register("orders", views.OrderViewSet, basename="orders")
router.register("promotions", views.PromotionViewSet, basename="promotions")

urlpatterns = [path("", include(router.urls))]
