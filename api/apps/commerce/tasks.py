"""
Commerce Celery tasks.
"""

import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def process_checkout(self, order_id: str):
    """
    Post-checkout processing: inventory reservation, notifications, etc.
    """
    from apps.commerce.models import Order, OrderItem

    try:
        order = Order.objects.prefetch_related("items__variant__inventory").get(id=order_id)
    except Order.DoesNotExist:
        return

    for item in order.items.all():
        if item.variant:
            try:
                inv = item.variant.inventory
                if inv.track_inventory:
                    inv.reserved += item.quantity
                    inv.save(update_fields=["reserved"])
            except Exception:
                pass

    order.status = Order.STATUS_CONFIRMED
    order.save(update_fields=["status"])
    logger.info("Order %s processed", order_id)


@shared_task
def check_low_inventory():
    """
    Periodic task: flag inventory items below reorder point.
    """
    from apps.commerce.models import Inventory

    low_stock = Inventory.objects.filter(
        track_inventory=True,
        quantity__lte=models_reorder_point(),
    )
    for inv in low_stock:
        logger.warning(
            "Low stock: variant=%s qty=%d reorder_point=%d",
            inv.variant_id,
            inv.quantity,
            inv.reorder_point,
        )


def models_reorder_point():
    from django.db.models import F
    from apps.commerce.models import Inventory
    return Inventory.reorder_point.field.default
