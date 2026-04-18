from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Channel, MessageTemplate, Campaign, DeliveryLog, EngagementMetric
from .serializers import (
    ChannelSerializer, MessageTemplateSerializer,
    CampaignSerializer, DeliveryLogSerializer, EngagementMetricSerializer,
)


class ChannelViewSet(viewsets.ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Channel.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class MessageTemplateViewSet(viewsets.ModelViewSet):
    serializer_class = MessageTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = MessageTemplate.objects.select_related("created_by")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Campaign.objects.select_related("channel", "template", "segment", "created_by")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def launch(self, request, pk=None):
        campaign = self.get_object()
        if campaign.status not in [Campaign.STATUS_DRAFT, Campaign.STATUS_SCHEDULED]:
            return Response({"detail": "Campaign cannot be launched from its current state."}, status=status.HTTP_400_BAD_REQUEST)
        from apps.communications.tasks import launch_campaign
        launch_campaign.delay(str(campaign.id))
        return Response({"detail": "Campaign launch queued."})

    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        campaign = self.get_object()
        campaign.status = Campaign.STATUS_PAUSED
        campaign.save(update_fields=["status"])
        return Response(CampaignSerializer(campaign).data)

    @action(detail=True, methods=["get"])
    def stats(self, request, pk=None):
        campaign = self.get_object()
        logs = campaign.delivery_logs
        return Response({
            "total": logs.count(),
            "sent": logs.filter(status="sent").count(),
            "delivered": logs.filter(status="delivered").count(),
            "failed": logs.filter(status="failed").count(),
            "bounced": logs.filter(status="bounced").count(),
        })


class DeliveryLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DeliveryLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = DeliveryLog.objects.select_related("campaign", "customer")
        if tenant:
            qs = qs.filter(customer__tenant=tenant)
        return qs
