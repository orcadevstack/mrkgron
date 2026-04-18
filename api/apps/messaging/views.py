from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Thread, Message
from .serializers import ThreadSerializer, MessageSerializer


class ThreadViewSet(viewsets.ModelViewSet):
    serializer_class = ThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Thread.objects.select_related("customer", "assigned_to")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

    @action(detail=True, methods=["get"])
    def messages(self, request, pk=None):
        thread = self.get_object()
        msgs = thread.messages.prefetch_related("attachments")
        return Response(MessageSerializer(msgs, many=True).data)

    @action(detail=True, methods=["post"])
    def reply(self, request, pk=None):
        thread = self.get_object()
        serializer = MessageSerializer(data={**request.data, "thread": thread.pk, "direction": "outbound"})
        serializer.is_valid(raise_exception=True)
        msg = serializer.save(sender_user=request.user)
        thread.last_message_at = timezone.now()
        thread.save(update_fields=["last_message_at"])
        return Response(MessageSerializer(msg).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        thread = self.get_object()
        thread.is_open = False
        thread.save(update_fields=["is_open"])
        return Response({"detail": "Thread closed."})
