from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Store, StoreTheme, StorePage, StoreSettings
from .serializers import StoreSerializer, StorePageSerializer, StoreThemeSerializer, StoreSettingsSerializer


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Store.objects.select_related("theme", "settings")
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        store = serializer.save(tenant=self.request.tenant)
        # Auto-create theme and settings
        StoreTheme.objects.get_or_create(store=store)
        StoreSettings.objects.get_or_create(store=store)

    @action(detail=True, methods=["get", "put", "patch"])
    def theme(self, request, pk=None):
        store = self.get_object()
        theme, _ = StoreTheme.objects.get_or_create(store=store)
        if request.method == "GET":
            return Response(StoreThemeSerializer(theme).data)
        serializer = StoreThemeSerializer(theme, data=request.data, partial=request.method == "PATCH")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=["get", "put", "patch"])
    def store_settings(self, request, pk=None):
        store = self.get_object()
        settings_obj, _ = StoreSettings.objects.get_or_create(store=store)
        if request.method == "GET":
            return Response(StoreSettingsSerializer(settings_obj).data)
        serializer = StoreSettingsSerializer(settings_obj, data=request.data, partial=request.method == "PATCH")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def pages(self, request, pk=None):
        store = self.get_object()
        pages = StorePage.objects.filter(store=store)
        return Response(StorePageSerializer(pages, many=True).data)


class StorePageViewSet(viewsets.ModelViewSet):
    serializer_class = StorePageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = StorePage.objects.select_related("store")
        tenant = self.request.tenant
        if tenant:
            qs = qs.filter(store__tenant=tenant)
        store_id = self.request.query_params.get("store")
        if store_id:
            qs = qs.filter(store_id=store_id)
        return qs

    def perform_create(self, serializer):
        store_id = self.request.data.get("store")
        store = get_object_or_404(Store, id=store_id, tenant=self.request.tenant)
        serializer.save(store=store)
