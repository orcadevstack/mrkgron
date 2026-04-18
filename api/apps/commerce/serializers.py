from rest_framework import serializers
from .models import Category, Product, Variant, Inventory, Cart, CartItem, Order, OrderItem, Payment, Shipment, Promotion


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "parent", "image", "is_active", "order", "created_at"]
        read_only_fields = ["id", "created_at"]


class VariantSerializer(serializers.ModelSerializer):
    inventory = serializers.SerializerMethodField()

    class Meta:
        model = Variant
        fields = ["id", "name", "sku", "price", "options", "images", "is_active", "inventory", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_inventory(self, obj):
        try:
            inv = obj.inventory
            return {"quantity": inv.quantity, "available": inv.available, "reserved": inv.reserved}
        except Exception:
            return None


class ProductSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "description", "short_description", "sku", "price", "compare_at_price", "currency", "status", "category", "is_physical", "weight", "dimensions", "images", "tags", "attributes", "seo_title", "seo_description", "variants", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class InventorySerializer(serializers.ModelSerializer):
    available = serializers.ReadOnlyField()

    class Meta:
        model = Inventory
        fields = ["id", "variant", "quantity", "reserved", "available", "reorder_point", "reorder_quantity", "warehouse_location", "track_inventory", "allow_backorder", "updated_at"]
        read_only_fields = ["id", "available", "updated_at"]


class CartItemSerializer(serializers.ModelSerializer):
    line_total = serializers.ReadOnlyField()
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "product_name", "variant", "quantity", "unit_price", "line_total", "added_at"]
        read_only_fields = ["id", "added_at"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ["id", "customer", "session_id", "promotion", "items", "total", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "variant", "name", "sku", "quantity", "unit_price", "discount_amount", "tax_amount", "total_price"]
        read_only_fields = ["id"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "provider", "provider_payment_id", "amount", "currency", "status", "payment_method", "processed_at", "created_at"]
        read_only_fields = fields


class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ["id", "carrier", "tracking_number", "tracking_url", "status", "shipped_at", "estimated_delivery", "delivered_at", "shipping_address", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    shipments = ShipmentSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "order_number", "customer", "status", "currency", "subtotal", "discount_amount", "tax_amount", "shipping_amount", "total_amount", "billing_address", "shipping_address", "notes", "items", "payments", "shipments", "placed_at", "created_at", "updated_at"]
        read_only_fields = ["id", "order_number", "created_at", "updated_at"]


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ["id", "code", "name", "promotion_type", "value", "minimum_order", "usage_limit", "used_count", "is_active", "starts_at", "ends_at", "created_at"]
        read_only_fields = ["id", "used_count", "created_at"]
