from rest_framework import serializers
from .models import Thread, Message, Attachment


class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ["id", "filename", "content_type", "size_bytes", "file", "created_at"]
        read_only_fields = ["id", "created_at"]


class MessageSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Message
        fields = ["id", "thread", "sender_user", "direction", "body", "html_body", "is_read", "metadata", "attachments", "created_at"]
        read_only_fields = ["id", "sender_user", "created_at"]


class ThreadSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Thread
        fields = ["id", "customer", "assigned_to", "subject", "channel_type", "is_open", "last_message_at", "last_message", "created_at"]
        read_only_fields = ["id", "last_message_at", "created_at"]

    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return MessageSerializer(last).data
        return None
