"""
Merchandising models — collections, banners, featured products, and pricing rules.
Supports conversion optimization and promotional display.
"""

import uuid
from django.db import models


class Collection(models.Model):
    """Curated product groupings (e.g., "Summer Sale", "Best Sellers")."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="collections")
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    products = models.ManyToManyField(
        "commerce.Product", blank=True, related_name="collections", through="CollectionProduct"
    )
    is_published = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    meta_title = models.CharField(max_length=512, blank=True)
    meta_description = models.CharField(max_length=1024, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "merchandising_collections"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name


class CollectionProduct(models.Model):
    """Through-table for Collection ↔ Product with custom sort position."""

    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    product = models.ForeignKey("commerce.Product", on_delete=models.CASCADE)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "merchandising_collection_products"
        ordering = ["position"]
        unique_together = [["collection", "product"]]


class Banner(models.Model):
    """Promotional banners displayed on storefront pages."""

    PLACEMENT_HERO = "hero"
    PLACEMENT_HEADER = "header"
    PLACEMENT_SIDEBAR = "sidebar"
    PLACEMENT_PRODUCT_PAGE = "product_page"
    PLACEMENT_CATEGORY_PAGE = "category_page"
    PLACEMENT_CHECKOUT = "checkout"
    PLACEMENT_POPUP = "popup"

    PLACEMENT_CHOICES = [
        (PLACEMENT_HERO, "Hero Banner"),
        (PLACEMENT_HEADER, "Header Bar"),
        (PLACEMENT_SIDEBAR, "Sidebar"),
        (PLACEMENT_PRODUCT_PAGE, "Product Page"),
        (PLACEMENT_CATEGORY_PAGE, "Category Page"),
        (PLACEMENT_CHECKOUT, "Checkout Page"),
        (PLACEMENT_POPUP, "Popup"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="banners")
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=512, blank=True)
    image_url = models.URLField(blank=True)
    mobile_image_url = models.URLField(blank=True)
    link_url = models.URLField(blank=True)
    cta_text = models.CharField(max_length=100, blank=True)
    placement = models.CharField(max_length=30, choices=PLACEMENT_CHOICES, default=PLACEMENT_HERO)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "merchandising_banners"
        ordering = ["placement", "sort_order"]

    def __str__(self):
        return f"{self.title} ({self.placement})"


class FeaturedProduct(models.Model):
    """Manually curated featured product slots on storefront."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="featured_products")
    product = models.ForeignKey("commerce.Product", on_delete=models.CASCADE, related_name="featured_slots")
    slot_name = models.CharField(max_length=100, help_text="e.g. homepage_hero, category_top")
    badge_text = models.CharField(max_length=50, blank=True, help_text="e.g. 'New', 'Hot', 'Sale'")
    position = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "merchandising_featured_products"
        ordering = ["slot_name", "position"]

    def __str__(self):
        return f"{self.product} @ {self.slot_name}"


class PricingRule(models.Model):
    """
    Dynamic pricing rule — overrides base price under specific conditions.
    Used for time-based pricing, VIP pricing, volume discounts.
    """

    TYPE_PERCENTAGE = "percentage"
    TYPE_FIXED_AMOUNT = "fixed_amount"
    TYPE_FIXED_PRICE = "fixed_price"

    TYPE_CHOICES = [
        (TYPE_PERCENTAGE, "Percentage Adjustment"),
        (TYPE_FIXED_AMOUNT, "Fixed Amount Off"),
        (TYPE_FIXED_PRICE, "Set Fixed Price"),
    ]

    SCOPE_ALL = "all"
    SCOPE_PRODUCT = "product"
    SCOPE_CATEGORY = "category"
    SCOPE_COLLECTION = "collection"
    SCOPE_SEGMENT = "customer_segment"

    SCOPE_CHOICES = [
        (SCOPE_ALL, "All Products"),
        (SCOPE_PRODUCT, "Specific Product"),
        (SCOPE_CATEGORY, "Category"),
        (SCOPE_COLLECTION, "Collection"),
        (SCOPE_SEGMENT, "Customer Segment"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="pricing_rules")
    name = models.CharField(max_length=255)
    rule_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    scope = models.CharField(max_length=20, choices=SCOPE_CHOICES, default=SCOPE_ALL)
    scope_ids = models.JSONField(default=list, help_text="IDs of products/categories/etc. this applies to")
    value = models.DecimalField(max_digits=10, decimal_places=4)
    min_quantity = models.PositiveIntegerField(default=1)
    priority = models.PositiveIntegerField(default=0, help_text="Higher = applied first")
    is_active = models.BooleanField(default=True)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "merchandising_pricing_rules"
        ordering = ["-priority"]

    def __str__(self):
        return f"{self.name} ({self.rule_type})"
