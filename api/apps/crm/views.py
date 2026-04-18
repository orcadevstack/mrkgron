from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Customer, Interaction, Preference, LifecycleStage
from .serializers import (
    CustomerSerializer, CustomerWriteSerializer,
    InteractionSerializer, PreferenceSerializer,
    LifecycleStageSerializer, CustomerProfileSerializer,
)
from .filters import CustomerFilter, InteractionFilter


class CustomerViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CustomerFilter
    search_fields = ["email", "first_name", "last_name", "company", "phone"]
    ordering_fields = ["created_at", "updated_at", "email", "status"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CustomerWriteSerializer
        return CustomerSerializer

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Customer.objects.select_related("profile", "score", "assigned_to")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

    @action(detail=True, methods=["get"])
    def interactions(self, request, pk=None):
        customer = self.get_object()
        interactions = customer.interactions.all()
        serializer = InteractionSerializer(interactions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def lifecycle(self, request, pk=None):
        customer = self.get_object()
        stages = customer.lifecycle_stages.all()
        serializer = LifecycleStageSerializer(stages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get", "put", "patch"])
    def preferences(self, request, pk=None):
        customer = self.get_object()
        pref, _ = Preference.objects.get_or_create(customer=customer)
        if request.method == "GET":
            return Response(PreferenceSerializer(pref).data)
        serializer = PreferenceSerializer(pref, data=request.data, partial=request.method == "PATCH")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=True, methods=["get", "put", "patch"])
    def profile(self, request, pk=None):
        customer = self.get_object()
        if request.method == "GET":
            return Response(CustomerProfileSerializer(customer.profile).data)
        serializer = CustomerProfileSerializer(customer.profile, data=request.data, partial=request.method == "PATCH")
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class InteractionViewSet(viewsets.ModelViewSet):
    serializer_class = InteractionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = InteractionFilter
    search_fields = ["subject", "body"]
    ordering_fields = ["occurred_at"]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Interaction.objects.select_related("customer", "performed_by")
        if tenant:
            qs = qs.filter(customer__tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(performed_by=self.request.user)


class LifecycleStageViewSet(viewsets.ModelViewSet):
    serializer_class = LifecycleStageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = LifecycleStage.objects.select_related("customer")
        if tenant:
            qs = qs.filter(customer__tenant=tenant)
        return qs
