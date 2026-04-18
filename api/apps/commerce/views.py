import uuid
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Variant, Inventory, Cart, CartItem, Order, Payment, Shipment, Promotion
from .serializers import (
    CategorySerializer, ProductSerializer, VariantSerializer, InventorySerializer,
    CartSerializer, CartItemSerializer, OrderSerializer, PaymentSerializer,
    ShipmentSerializer, PromotionSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Category.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "category", "taxable"]
    search_fields = ["name", "sku", "description"]
    ordering_fields = ["price", "created_at", "name"]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Product.objects.prefetch_related("variants", "variants__inventory")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, created_by=self.request.user)


class InventoryViewSet(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Inventory.objects.select_related("variant__product")
        if tenant:
            qs = qs.filter(variant__product__tenant=tenant)
        return qs


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Cart.objects.prefetch_related("items__product", "items__variant")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

    @action(detail=True, methods=["post"])
    def add_item(self, request, pk=None):
        cart = self.get_object()
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        variant = serializer.validated_data.get("variant")
        qty = serializer.validated_data.get("quantity", 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, variant=variant,
            defaults={"unit_price": variant.price if variant and variant.price else product.price, "quantity": qty},
        )
        if not created:
            item.quantity += qty
            item.save(update_fields=["quantity"])

        return Response(CartSerializer(cart).data)

    @action(detail=True, methods=["post"])
    def checkout(self, request, pk=None):
        cart = self.get_object()
        if not cart.items.exists():
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        from apps.commerce.tasks import process_checkout
        order_number = f"ORD-{str(uuid.uuid4())[:8].upper()}"
        subtotal = cart.total
        order = Order.objects.create(
            tenant=cart.tenant,
            customer=cart.customer,
            order_number=order_number,
            subtotal=subtotal,
            total_amount=subtotal,
            billing_address=request.data.get("billing_address", {}),
            shipping_address=request.data.get("shipping_address", {}),
            placed_at=timezone.now(),
        )
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                variant=item.variant,
                name=item.product.name,
                sku=item.product.sku,
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.line_total,
            )
        process_checkout.delay(str(order.id))
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["status", "customer"]
    search_fields = ["order_number"]
    ordering_fields = ["created_at", "total_amount"]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Order.objects.prefetch_related("items", "payments", "shipments")
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        order = self.get_object()
        order.status = Order.STATUS_CONFIRMED
        order.save(update_fields=["status"])
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in [Order.STATUS_SHIPPED, Order.STATUS_DELIVERED]:
            return Response({"detail": "Cannot cancel a shipped or delivered order."}, status=status.HTTP_400_BAD_REQUEST)
        order.status = Order.STATUS_CANCELLED
        order.save(update_fields=["status"])
        return Response(OrderSerializer(order).data)


class PromotionViewSet(viewsets.ModelViewSet):
    serializer_class = PromotionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        tenant = self.request.tenant
        qs = Promotion.objects.all()
        if tenant:
            qs = qs.filter(tenant=tenant)
        return qs

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)
