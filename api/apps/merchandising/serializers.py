from rest_framework import serializers
from .models import Collection, CollectionProduct, Banner, FeaturedProduct, PricingRule


class CollectionProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionProduct
        fields = ["product", "position"]


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = [
            "id", "name", "slug", "description", "image_url", "is_published",
            "sort_order", "meta_title", "meta_description", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = [
            "id", "title", "subtitle", "image_url", "mobile_image_url",
            "link_url", "cta_text", "placement", "is_active",
            "starts_at", "ends_at", "sort_order", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class FeaturedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeaturedProduct
        fields = [
            "id", "product", "slot_name", "badge_text", "position",
            "is_active", "starts_at", "ends_at", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class PricingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingRule
        fields = [
            "id", "name", "rule_type", "scope", "scope_ids", "value",
            "min_quantity", "priority", "is_active", "starts_at", "ends_at", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
