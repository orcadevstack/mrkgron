"""
Storefront models — store configuration, pages, themes, and SEO settings.
"""

import uuid
from django.db import models


class Store(models.Model):
    """Top-level store entity (one per tenant or multiple white-labelled stores)."""

    STATUS_ACTIVE = "active"
    STATUS_MAINTENANCE = "maintenance"
    STATUS_INACTIVE = "inactive"

    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_MAINTENANCE, "Maintenance"),
        (STATUS_INACTIVE, "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="stores")
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100, unique=True)
    domain = models.CharField(max_length=255, blank=True)
    tagline = models.CharField(max_length=512, blank=True)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    favicon_url = models.URLField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_ACTIVE)
    currency = models.CharField(max_length=3, default="USD")
    timezone = models.CharField(max_length=64, default="UTC")
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=30, blank=True)
    address = models.JSONField(default=dict)
    social_links = models.JSONField(default=dict)
    analytics_config = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "storefront_stores"
        ordering = ["name"]

    def __str__(self):
        return self.name


class StoreTheme(models.Model):
    """Visual theme configuration for a store."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name="theme")
    primary_color = models.CharField(max_length=7, default="#3b82f6")
    secondary_color = models.CharField(max_length=7, default="#6366f1")
    accent_color = models.CharField(max_length=7, default="#f59e0b")
    background_color = models.CharField(max_length=7, default="#ffffff")
    font_heading = models.CharField(max_length=100, default="Inter")
    font_body = models.CharField(max_length=100, default="Inter")
    custom_css = models.TextField(blank=True)
    header_layout = models.CharField(max_length=30, default="standard")
    footer_layout = models.CharField(max_length=30, default="standard")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "storefront_themes"

    def __str__(self):
        return f"Theme for {self.store.name}"


class StorePage(models.Model):
    """CMS pages within a store (home, about, contact, landing pages)."""

    PAGE_HOME = "home"
    PAGE_ABOUT = "about"
    PAGE_CONTACT = "contact"
    PAGE_POLICY = "policy"
    PAGE_CUSTOM = "custom"
    PAGE_LANDING = "landing"

    PAGE_TYPES = [
        (PAGE_HOME, "Home"),
        (PAGE_ABOUT, "About"),
        (PAGE_CONTACT, "Contact"),
        (PAGE_POLICY, "Policy"),
        (PAGE_LANDING, "Landing Page"),
        (PAGE_CUSTOM, "Custom"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="pages")
    page_type = models.CharField(max_length=20, choices=PAGE_TYPES, default=PAGE_CUSTOM)
    title = models.CharField(max_length=512)
    slug = models.SlugField(max_length=255)
    content = models.TextField(blank=True)
    blocks = models.JSONField(default=list)
    meta_title = models.CharField(max_length=512, blank=True)
    meta_description = models.CharField(max_length=1024, blank=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "storefront_pages"
        unique_together = [["store", "slug"]]
        ordering = ["title"]

    def __str__(self):
        return f"{self.store.name} / {self.title}"


class StoreSettings(models.Model):
    """Operational settings for a store."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.OneToOneField(Store, on_delete=models.CASCADE, related_name="settings")
    tax_enabled = models.BooleanField(default=True)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=4, default=0)
    tax_inclusive = models.BooleanField(default=False)
    guest_checkout = models.BooleanField(default=True)
    inventory_tracking = models.BooleanField(default=True)
    allow_backorders = models.BooleanField(default=False)
    min_order_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    max_order_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    payment_methods = models.JSONField(default=list)
    shipping_methods = models.JSONField(default=list)
    notification_emails = models.JSONField(default=list)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "storefront_settings"

    def __str__(self):
        return f"Settings for {self.store.name}"
