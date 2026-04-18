from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Integration, WebhookEndpoint, WebhookDelivery, APIKey, IntegrationLog
from .serializers import (
    IntegrationSerializer,
    WebhookEndpointSerializer,
    WebhookDeliverySerializer,
    APIKeySerializer,
    APIKeyCreateSerializer,
    IntegrationLogSerializer,
)


class IntegrationViewSet(viewsets.ModelViewSet):
    serializer_class = IntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Integration.objects.filter(tenant=self.request.tenant).order_by("name")

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["get"])
    def logs(self, request, pk=None):
        integration = self.get_object()
        qs = integration.logs.order_by("-created_at")[:100]
        return Response(IntegrationLogSerializer(qs, many=True).data)

    @action(detail=True, methods=["post"])
    def disconnect(self, request, pk=None):
        integration = self.get_object()
        integration.status = Integration.STATUS_DISCONNECTED
        integration.save(update_fields=["status", "updated_at"])
        return Response({"status": "disconnected"})


class WebhookEndpointViewSet(viewsets.ModelViewSet):
    serializer_class = WebhookEndpointSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WebhookEndpoint.objects.filter(tenant=self.request.tenant)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["get"])
    def deliveries(self, request, pk=None):
        endpoint = self.get_object()
        qs = endpoint.deliveries.order_by("-delivered_at")[:50]
        return Response(WebhookDeliverySerializer(qs, many=True).data)


class APIKeyViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return APIKey.objects.filter(tenant=self.request.tenant)

    def get_serializer_class(self):
        if self.action == "create":
            return APIKeyCreateSerializer
        return APIKeySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(tenant=request.tenant, created_by=request.user)
        out = APIKeySerializer(instance, context={"raw_key": instance._raw_key})
        return Response(out.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def revoke(self, request, pk=None):
        api_key = self.get_object()
        api_key.is_active = False
        api_key.save(update_fields=["is_active"])
        return Response({"status": "revoked"})
