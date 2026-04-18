from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Trigger, Action, Workflow, WorkflowExecution
from .serializers import (
    TriggerSerializer, ActionSerializer,
    WorkflowSerializer, WorkflowExecutionSerializer,
)


class TriggerViewSet(viewsets.ModelViewSet):
    serializer_class = TriggerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Trigger.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class ActionViewSet(viewsets.ModelViewSet):
    serializer_class = ActionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Action.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Workflow.objects.prefetch_related("steps__action")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        workflow = self.get_object()
        workflow.status = Workflow.STATUS_ACTIVE
        workflow.save(update_fields=["status"])
        return Response(WorkflowSerializer(workflow).data)

    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        workflow = self.get_object()
        workflow.status = Workflow.STATUS_PAUSED
        workflow.save(update_fields=["status"])
        return Response(WorkflowSerializer(workflow).data)

    @action(detail=True, methods=["post"])
    def trigger_manually(self, request, pk=None):
        workflow = self.get_object()
        customer_id = request.data.get("customer_id")
        trigger_data = request.data.get("trigger_data", {})
        execution = WorkflowExecution.objects.create(
            workflow=workflow,
            customer_id=customer_id,
            trigger_data=trigger_data,
        )
        from apps.automation.tasks import execute_workflow
        execute_workflow.delay(str(execution.id))
        return Response(WorkflowExecutionSerializer(execution).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def executions(self, request, pk=None):
        workflow = self.get_object()
        qs = WorkflowExecution.objects.filter(workflow=workflow).select_related("customer")
        return Response(WorkflowExecutionSerializer(qs, many=True).data)


class WorkflowExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = WorkflowExecutionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = WorkflowExecution.objects.select_related("workflow", "customer")
        if tenant:
            qs = qs.filter(workflow__tenant=tenant)
        return qs
