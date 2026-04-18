from django.contrib import admin
from .models import Collection, Banner, FeaturedProduct, PricingRule, CollectionProduct


class CollectionProductInline(admin.TabularInline):
    model = CollectionProduct
    extra = 1


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_published", "sort_order", "created_at"]
    list_filter = ["is_published"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [CollectionProductInline]


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["title", "placement", "is_active", "starts_at", "ends_at"]
    list_filter = ["placement", "is_active"]


@admin.register(FeaturedProduct)
class FeaturedProductAdmin(admin.ModelAdmin):
    list_display = ["product", "slot_name", "badge_text", "position", "is_active"]
    list_filter = ["slot_name", "is_active"]


@admin.register(PricingRule)
class PricingRuleAdmin(admin.ModelAdmin):
    list_display = ["name", "rule_type", "scope", "value", "priority", "is_active"]
    list_filter = ["rule_type", "scope", "is_active"]
