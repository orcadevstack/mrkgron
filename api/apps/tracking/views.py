from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Session, RawEvent, IdentityMap
from .serializers import (
    SessionSerializer, RawEventSerializer,
    RawEventIngestSerializer, IdentityMapSerializer,
)
from apps.tracking.tasks import process_raw_event, resolve_identity


class EventIngestView(viewsets.ViewSet):
    """
    POST /api/v1/tracking/ingest/
    Public-ish endpoint (requires tenant header). Receives events from JS SDK.
    """
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        serializer = RawEventIngestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        tenant = request.tenant
        raw = RawEvent.objects.create(
            tenant=tenant,
            event_type=data["event_type"],
            event_name=data["event_name"],
            anonymous_id=data.get("anonymous_id", ""),
            properties=data.get("properties", {}),
            context=data.get("context", {}),
        )
        process_raw_event.delay(str(raw.id))
        return Response({"id": str(raw.id)}, status=status.HTTP_202_ACCEPTED)


class SessionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Session.objects.prefetch_related("page_views")
        tenant = self.request.tenant
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs


class RawEventViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = RawEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = RawEvent.objects.all()
        tenant = self.request.tenant
        if tenant:
            qs = qs.filter(tenant=tenant)
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs


class IdentityMapViewSet(viewsets.ModelViewSet):
    serializer_class = IdentityMapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = IdentityMap.objects.select_related("customer")
        tenant = self.request.tenant
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        instance = serializer.save(tenant=self.request.tenant)
        resolve_identity.delay(str(instance.id))
