from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Journey, JourneyStep, JourneyEnrollment
from .serializers import JourneySerializer, JourneyStepSerializer, JourneyEnrollmentSerializer


class JourneyViewSet(viewsets.ModelViewSet):
    serializer_class = JourneySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Journey.objects.prefetch_related("steps")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def activate(self, request, pk=None):
        journey = self.get_object()
        journey.status = Journey.STATUS_ACTIVE
        journey.save(update_fields=["status"])
        return Response(JourneySerializer(journey).data)

    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        journey = self.get_object()
        journey.status = Journey.STATUS_PAUSED
        journey.save(update_fields=["status"])
        return Response(JourneySerializer(journey).data)

    @action(detail=True, methods=["post"])
    def enroll(self, request, pk=None):
        journey = self.get_object()
        customer_id = request.data.get("customer_id")
        if not customer_id:
            return Response({"detail": "customer_id required."}, status=status.HTTP_400_BAD_REQUEST)
        if not journey.allow_re_entry:
            existing = JourneyEnrollment.objects.filter(journey=journey, customer_id=customer_id, status=JourneyEnrollment.STATUS_ACTIVE).exists()
            if existing:
                return Response({"detail": "Customer already enrolled."}, status=status.HTTP_409_CONFLICT)
        first_step = journey.steps.order_by("order").first()
        enrollment = JourneyEnrollment.objects.create(
            journey=journey,
            customer_id=customer_id,
            current_step=first_step,
        )
        from apps.journeys.tasks import execute_journey_step
        if first_step:
            execute_journey_step.delay(str(enrollment.id))
        return Response(JourneyEnrollmentSerializer(enrollment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def enrollments(self, request, pk=None):
        journey = self.get_object()
        qs = JourneyEnrollment.objects.filter(journey=journey).select_related("customer", "current_step")
        return Response(JourneyEnrollmentSerializer(qs, many=True).data)


class JourneyStepViewSet(viewsets.ModelViewSet):
    serializer_class = JourneyStepSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JourneyStep.objects.filter(journey_id=self.kwargs.get("journey_pk"))
