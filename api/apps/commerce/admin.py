from django.contrib import admin
from .models import Category, Product, Variant, Inventory, Cart, Order, OrderItem, Payment, Shipment, Promotion


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "parent", "is_active", "order"]
    list_filter = ["is_active"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "price", "status", "category", "created_at"]
    list_filter = ["status", "taxable", "is_physical"]
    search_fields = ["name", "sku"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Variant)
class VariantAdmin(admin.ModelAdmin):
    list_display = ["product", "name", "sku", "price", "is_active"]
    search_fields = ["name", "sku"]


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ["variant", "quantity", "reserved", "reorder_point", "track_inventory"]
    list_filter = ["track_inventory", "allow_backorder"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "customer", "status", "total_amount", "placed_at"]
    list_filter = ["status"]
    search_fields = ["order_number"]
    inlines = [OrderItemInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["order", "provider", "amount", "status", "processed_at"]
    list_filter = ["provider", "status"]


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ["order", "carrier", "tracking_number", "status", "shipped_at"]
    list_filter = ["status"]


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "promotion_type", "value", "is_active", "used_count"]
    list_filter = ["promotion_type", "is_active"]
    search_fields = ["name", "code"]
