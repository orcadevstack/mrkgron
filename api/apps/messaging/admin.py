from django.contrib import admin
from .models import Thread, Message, Attachment


@admin.register(Thread)
class ThreadAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "channel_type", "is_open", "last_message_at"]
    list_filter = ["channel_type", "is_open"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["thread", "direction", "is_read", "created_at"]
    list_filter = ["direction", "is_read"]
