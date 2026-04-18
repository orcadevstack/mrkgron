from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Segment, SegmentMembership
from .serializers import SegmentSerializer, SegmentMembershipSerializer


class SegmentViewSet(viewsets.ModelViewSet):
    serializer_class = SegmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Segment.objects.prefetch_related("rules")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def refresh(self, request, pk=None):
        segment = self.get_object()
        from apps.segments.tasks import refresh_segment
        refresh_segment.delay(str(segment.id))
        return Response({"detail": "Segment refresh queued."})

    @action(detail=True, methods=["get"])
    def members(self, request, pk=None):
        segment = self.get_object()
        memberships = SegmentMembership.objects.filter(segment=segment).select_related("customer")
        serializer = SegmentMembershipSerializer(memberships, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def add_member(self, request, pk=None):
        segment = self.get_object()
        customer_id = request.data.get("customer_id")
        if not customer_id:
            return Response({"detail": "customer_id required."}, status=status.HTTP_400_BAD_REQUEST)
        membership, created = SegmentMembership.objects.get_or_create(
            segment=segment, customer_id=customer_id, defaults={"added_via": "manual"}
        )
        if created:
            segment.member_count = segment.members.count()
            segment.save(update_fields=["member_count"])
        return Response(SegmentMembershipSerializer(membership).data)
