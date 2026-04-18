from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register("collections", views.CollectionViewSet, basename="collections")
router.register("banners", views.BannerViewSet, basename="banners")
router.register("featured", views.FeaturedProductViewSet, basename="featured-products")
router.register("pricing-rules", views.PricingRuleViewSet, basename="pricing-rules")

urlpatterns = [path("", include(router.urls))]
