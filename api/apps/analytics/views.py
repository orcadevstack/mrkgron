from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event, Metric, Dashboard, Widget, Report, ForecastModel
from .serializers import (
    EventSerializer, MetricSerializer, DashboardSerializer,
    WidgetSerializer, ReportSerializer, ForecastModelSerializer,
)


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Event.objects.select_related("customer")
        if tenant:
            qs = qs.filter(tenant=tenant)
        event_name = self.request.query_params.get("event_name")
        if event_name:
            qs = qs.filter(event_name=event_name)
        return qs

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.tenant,
            occurred_at=serializer.validated_data.get("occurred_at", timezone.now()),
            ip_address=self.request.META.get("REMOTE_ADDR"),
        )


class MetricViewSet(viewsets.ModelViewSet):
    serializer_class = MetricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Metric.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class DashboardViewSet(viewsets.ModelViewSet):
    serializer_class = DashboardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Dashboard.objects.prefetch_related("widgets")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def add_widget(self, request, pk=None):
        dashboard = self.get_object()
        serializer = WidgetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        widget = serializer.save(dashboard=dashboard)
        return Response(WidgetSerializer(widget).data, status=status.HTTP_201_CREATED)


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Report.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def run(self, request, pk=None):
        report = self.get_object()
        from apps.analytics.tasks import generate_report
        generate_report.delay(str(report.id))
        return Response({"detail": "Report generation queued."})


class ForecastModelViewSet(viewsets.ModelViewSet):
    serializer_class = ForecastModelSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = ForecastModel.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

    @action(detail=True, methods=["post"])
    def train(self, request, pk=None):
        forecast_model = self.get_object()
        from apps.analytics.tasks import train_forecast_model
        train_forecast_model.delay(str(forecast_model.id))
        return Response({"detail": "Model training queued."})


class AnalyticsSummaryView(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        tenant = request.tenant
        if not tenant:
            return Response({})

        from apps.crm.models import Customer
        from apps.commerce.models import Order

        customer_count = Customer.objects.filter(tenant=tenant).count()
        active_customers = Customer.objects.filter(tenant=tenant, status="active").count()
        total_events = Event.objects.filter(tenant=tenant).count()

        revenue = 0
        try:
            from django.db.models import Sum
            revenue = Order.objects.filter(
                tenant=tenant, status="completed"
            ).aggregate(total=Sum("total_amount"))["total"] or 0
        except Exception:
            pass

        return Response({
            "customer_count": customer_count,
            "active_customers": active_customers,
            "total_events": total_events,
            "total_revenue": float(revenue),
        })
