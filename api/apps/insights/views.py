from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Insight, InsightRule
from .serializers import InsightSerializer, InsightRuleSerializer
from apps.insights.tasks import generate_insights_for_tenant


class InsightRuleViewSet(viewsets.ModelViewSet):
    serializer_class = InsightRuleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = InsightRule.objects.all()
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)


class InsightViewSet(viewsets.ModelViewSet):
    serializer_class = InsightSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Insight.objects.select_related("rule").filter(is_dismissed=False)
        if self.request.tenant:
            qs = qs.filter(tenant=self.request.tenant)
        priority = self.request.query_params.get("priority")
        if priority:
            qs = qs.filter(priority=priority)
        unread = self.request.query_params.get("unread")
        if unread == "true":
            qs = qs.filter(is_read=False)
        return qs

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        insight = self.get_object()
        insight.is_read = True
        insight.save(update_fields=["is_read"])
        return Response(InsightSerializer(insight).data)

    @action(detail=True, methods=["post"])
    def dismiss(self, request, pk=None):
        insight = self.get_object()
        insight.is_dismissed = True
        insight.save(update_fields=["is_dismissed"])
        return Response({"status": "dismissed"})

    @action(detail=False, methods=["post"])
    def generate(self, request):
        if request.tenant:
            generate_insights_for_tenant.delay(str(request.tenant.id))
        return Response({"status": "generation triggered"})
