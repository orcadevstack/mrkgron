from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Collection, Banner, FeaturedProduct, PricingRule
from .serializers import (
    CollectionSerializer, BannerSerializer,
    FeaturedProductSerializer, PricingRuleSerializer,
)


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Collection.objects.all()
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        published = self.request.query_params.get("published")
        if published == "true":
            qs = qs.filter(is_published=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class BannerViewSet(viewsets.ModelViewSet):
    serializer_class = BannerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Banner.objects.all()
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        placement = self.request.query_params.get("placement")
        if placement:
            qs = qs.filter(placement=placement)
        active = self.request.query_params.get("active")
        if active == "true":
            qs = qs.filter(is_active=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class FeaturedProductViewSet(viewsets.ModelViewSet):
    serializer_class = FeaturedProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = FeaturedProduct.objects.select_related("product")
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        slot = self.request.query_params.get("slot")
        if slot:
            qs = qs.filter(slot_name=slot)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class PricingRuleViewSet(viewsets.ModelViewSet):
    serializer_class = PricingRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = PricingRule.objects.all()
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)
