"""
Commerce models: Category, Product, Variant, Inventory, Cart, Order, Payment, Shipment, Promotion.
"""

import uuid
from django.conf import settings
from django.db import models


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=300)
    description = models.TextField(blank=True)
    parent = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, blank=True, related_name="children")
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commerce_categories"
        unique_together = [["tenant", "slug"]]
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    STATUS_DRAFT = "draft"
    STATUS_ACTIVE = "active"
    STATUS_ARCHIVED = "archived"

    STATUS_CHOICES = [
        (STATUS_DRAFT, "Draft"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_ARCHIVED, "Archived"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products")
    name = models.CharField(max_length=500)
    slug = models.SlugField(max_length=600)
    description = models.TextField(blank=True)
    short_description = models.TextField(blank=True)
    sku = models.CharField(max_length=200, blank=True)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default="USD")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT, db_index=True)
    is_physical = models.BooleanField(default=True)
    weight = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    dimensions = models.JSONField(default=dict)
    images = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    attributes = models.JSONField(default=dict)
    seo_title = models.CharField(max_length=300, blank=True)
    seo_description = models.TextField(blank=True)
    requires_shipping = models.BooleanField(default=True)
    taxable = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "commerce_products"
        unique_together = [["tenant", "slug"]]
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tenant", "status"]),
            models.Index(fields=["tenant", "category"]),
        ]

    def __str__(self):
        return self.name


class Variant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=200, blank=True)
    price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    options = models.JSONField(default=dict)
    images = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commerce_variants"

    def __str__(self):
        return f"{self.product.name} — {self.name}"


class Inventory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant = models.OneToOneField(Variant, on_delete=models.CASCADE, related_name="inventory")
    quantity = models.IntegerField(default=0)
    reserved = models.IntegerField(default=0)
    reorder_point = models.IntegerField(default=5)
    reorder_quantity = models.IntegerField(default=20)
    warehouse_location = models.CharField(max_length=200, blank=True)
    track_inventory = models.BooleanField(default=True)
    allow_backorder = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "commerce_inventory"

    @property
    def available(self):
        return max(0, self.quantity - self.reserved)

    def __str__(self):
        return f"Inventory for {self.variant}"


class Promotion(models.Model):
    TYPE_PERCENTAGE = "percentage"
    TYPE_FIXED = "fixed"
    TYPE_FREE_SHIPPING = "free_shipping"
    TYPE_BUY_X_GET_Y = "bxgy"

    TYPE_CHOICES = [
        (TYPE_PERCENTAGE, "Percentage Discount"),
        (TYPE_FIXED, "Fixed Amount"),
        (TYPE_FREE_SHIPPING, "Free Shipping"),
        (TYPE_BUY_X_GET_Y, "Buy X Get Y"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="promotions")
    code = models.CharField(max_length=100, blank=True, db_index=True)
    name = models.CharField(max_length=255)
    promotion_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    minimum_order = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    applicable_products = models.ManyToManyField(Product, blank=True)
    conditions = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commerce_promotions"
        unique_together = [["tenant", "code"]]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="carts")
    customer = models.ForeignKey("crm.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="carts")
    session_id = models.CharField(max_length=255, blank=True, db_index=True)
    promotion = models.ForeignKey(Promotion, on_delete=models.SET_NULL, null=True, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "commerce_carts"

    def __str__(self):
        return f"Cart {self.id}"

    @property
    def total(self):
        return sum(item.line_total for item in self.items.all())


class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(Variant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=14, decimal_places=2)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commerce_cart_items"
        unique_together = [["cart", "product", "variant"]]

    @property
    def line_total(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"


class Order(models.Model):
    STATUS_PENDING = "pending"
    STATUS_CONFIRMED = "confirmed"
    STATUS_PROCESSING = "processing"
    STATUS_SHIPPED = "shipped"
    STATUS_DELIVERED = "delivered"
    STATUS_CANCELLED = "cancelled"
    STATUS_REFUNDED = "refunded"
    STATUS_COMPLETED = "completed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_PROCESSING, "Processing"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_REFUNDED, "Refunded"),
        (STATUS_COMPLETED, "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="orders")
    customer = models.ForeignKey("crm.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    order_number = models.CharField(max_length=100, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    currency = models.CharField(max_length=3, default="USD")
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    shipping_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    promotion = models.ForeignKey(Promotion, on_delete=models.SET_NULL, null=True, blank=True)
    billing_address = models.JSONField(default=dict)
    shipping_address = models.JSONField(default=dict)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict)
    placed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "commerce_orders"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tenant", "status"]),
            models.Index(fields=["tenant", "customer"]),
        ]

    def __str__(self):
        return f"Order #{self.order_number}"


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    variant = models.ForeignKey(Variant, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=500)
    sku = models.CharField(max_length=200, blank=True)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=14, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=14, decimal_places=2)
    metadata = models.JSONField(default=dict)

    class Meta:
        db_table = "commerce_order_items"

    def __str__(self):
        return f"{self.quantity}x {self.name}"


class Payment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_PROCESSING = "processing"
    STATUS_SUCCEEDED = "succeeded"
    STATUS_FAILED = "failed"
    STATUS_REFUNDED = "refunded"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PROCESSING, "Processing"),
        (STATUS_SUCCEEDED, "Succeeded"),
        (STATUS_FAILED, "Failed"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    PROVIDER_STRIPE = "stripe"
    PROVIDER_PAYPAL = "paypal"
    PROVIDER_MANUAL = "manual"

    PROVIDER_CHOICES = [
        (PROVIDER_STRIPE, "Stripe"),
        (PROVIDER_PAYPAL, "PayPal"),
        (PROVIDER_MANUAL, "Manual"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES, default=PROVIDER_STRIPE)
    provider_payment_id = models.CharField(max_length=500, blank=True)
    provider_customer_id = models.CharField(max_length=500, blank=True)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default="USD")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    payment_method = models.CharField(max_length=100, blank=True)
    metadata = models.JSONField(default=dict)
    processed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commerce_payments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment {self.id} — {self.status}"


class Shipment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_READY = "ready"
    STATUS_SHIPPED = "shipped"
    STATUS_IN_TRANSIT = "in_transit"
    STATUS_DELIVERED = "delivered"
    STATUS_RETURNED = "returned"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_READY, "Ready to Ship"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_IN_TRANSIT, "In Transit"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_RETURNED, "Returned"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="shipments")
    carrier = models.CharField(max_length=200, blank=True)
    tracking_number = models.CharField(max_length=500, blank=True)
    tracking_url = models.URLField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_PENDING, db_index=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    estimated_delivery = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    shipping_address = models.JSONField(default=dict)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "commerce_shipments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Shipment {self.tracking_number or self.id}"
