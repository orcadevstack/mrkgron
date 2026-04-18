from django.contrib import admin
from .models import Store, StoreTheme, StorePage, StoreSettings


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "status", "currency", "created_at"]
    list_filter = ["status", "currency"]
    search_fields = ["name", "slug", "domain"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(StoreTheme)
class StoreThemeAdmin(admin.ModelAdmin):
    list_display = ["store", "primary_color", "font_heading", "updated_at"]


@admin.register(StorePage)
class StorePageAdmin(admin.ModelAdmin):
    list_display = ["title", "store", "page_type", "is_published", "created_at"]
    list_filter = ["page_type", "is_published"]
    prepopulated_fields = {"slug": ("title",)}


@admin.register(StoreSettings)
class StoreSettingsAdmin(admin.ModelAdmin):
    list_display = ["store", "tax_enabled", "guest_checkout", "inventory_tracking"]
