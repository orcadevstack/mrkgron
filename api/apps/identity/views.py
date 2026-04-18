from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import IdentityProfile, IdentityAlias, MergeEvent
from .serializers import (
    IdentityProfileSerializer,
    IdentityAliasSerializer,
    MergeEventSerializer,
    MergeRequestSerializer,
)


class IdentityProfileViewSet(viewsets.ModelViewSet):
    serializer_class = IdentityProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return IdentityProfile.objects.filter(tenant=self.request.tenant).prefetch_related("aliases")

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

    @action(detail=False, methods=["post"])
    def merge(self, request):
        """Merge source profile into target, migrating all aliases and logging the event."""
        sr = MergeRequestSerializer(data=request.data)
        sr.is_valid(raise_exception=True)

        tenant = request.tenant
        try:
            source = IdentityProfile.objects.get(pk=sr.validated_data["source_profile_id"], tenant=tenant)
            target = IdentityProfile.objects.get(pk=sr.validated_data["target_profile_id"], tenant=tenant)
        except IdentityProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        with transaction.atomic():
            # Move aliases to target
            IdentityAlias.objects.filter(profile=source).update(profile=target)

            # Update best-known identifiers
            if not target.primary_email and source.primary_email:
                target.primary_email = source.primary_email
            if not target.primary_phone and source.primary_phone:
                target.primary_phone = source.primary_phone
            target.traits.update(source.traits)
            if target.is_anonymous and not source.is_anonymous:
                target.is_anonymous = False
            target.save()

            MergeEvent.objects.create(
                tenant=tenant,
                source_profile_id=source.pk,
                target_profile=target,
                merged_by=request.user,
                reason=sr.validated_data.get("reason", ""),
            )
            source.delete()

        return Response(IdentityProfileSerializer(target).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"])
    def merge_history(self, request, pk=None):
        profile = self.get_object()
        events = profile.received_merges.order_by("-merged_at")
        return Response(MergeEventSerializer(events, many=True).data)

    @action(detail=True, methods=["post"])
    def add_alias(self, request, pk=None):
        profile = self.get_object()
        sr = IdentityAliasSerializer(data=request.data)
        sr.is_valid(raise_exception=True)
        alias = sr.save(profile=profile)
        return Response(IdentityAliasSerializer(alias).data, status=status.HTTP_201_CREATED)
