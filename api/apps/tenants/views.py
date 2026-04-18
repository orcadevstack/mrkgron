from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from .models import Tenant, TenantMembership, TenantInvitation
from .serializers import TenantSerializer, TenantMembershipSerializer, TenantInvitationSerializer
from core.permissions import IsTenantAdmin


class TenantViewSet(ModelViewSet):
    serializer_class = TenantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Tenant.objects.all()
        tenant_ids = user.tenant_memberships.filter(is_active=True).values_list("tenant_id", flat=True)
        return Tenant.objects.filter(id__in=tenant_ids)

    def perform_create(self, serializer):
        tenant = serializer.save()
        TenantMembership.objects.create(
            tenant=tenant,
            user=self.request.user,
            role=TenantMembership.ROLE_OWNER,
        )


class TenantMembershipViewSet(ModelViewSet):
    serializer_class = TenantMembershipSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def get_queryset(self):
        tenant = self.request.tenant
        if tenant:
            return TenantMembership.objects.filter(tenant=tenant).select_related("user", "tenant")
        return TenantMembership.objects.none()


class InviteMemberView(generics.CreateAPIView):
    serializer_class = TenantInvitationSerializer
    permission_classes = [permissions.IsAuthenticated, IsTenantAdmin]

    def perform_create(self, serializer):
        serializer.save(
            tenant=self.request.tenant,
            invited_by=self.request.user,
            expires_at=timezone.now() + timedelta(days=7),
        )


class AcceptInvitationView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token):
        try:
            invitation = TenantInvitation.objects.get(
                token=token,
                status=TenantInvitation.STATUS_PENDING,
                expires_at__gt=timezone.now(),
            )
        except TenantInvitation.DoesNotExist:
            return Response({"detail": "Invalid or expired invitation."}, status=status.HTTP_400_BAD_REQUEST)

        membership, created = TenantMembership.objects.get_or_create(
            tenant=invitation.tenant,
            user=request.user,
            defaults={"role": invitation.role},
        )
        invitation.status = TenantInvitation.STATUS_ACCEPTED
        invitation.save(update_fields=["status"])
        return Response(TenantMembershipSerializer(membership).data)
