from rest_framework import serializers
from .models import Store, StoreTheme, StorePage, StoreSettings


class StoreThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreTheme
        exclude = ["store"]
        read_only_fields = ["id", "updated_at"]


class StoreSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreSettings
        exclude = ["store"]
        read_only_fields = ["id", "updated_at"]


class StorePageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StorePage
        fields = [
            "id", "page_type", "title", "slug", "content", "blocks",
            "meta_title", "meta_description", "is_published", "published_at",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class StoreSerializer(serializers.ModelSerializer):
    theme = StoreThemeSerializer(read_only=True)
    settings = StoreSettingsSerializer(read_only=True)

    class Meta:
        model = Store
        fields = [
            "id", "name", "slug", "domain", "tagline", "description",
            "logo_url", "favicon_url", "status", "currency", "timezone",
            "contact_email", "social_links", "theme", "settings",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
