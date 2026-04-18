"""
Tracking Celery tasks — normalization & identity resolution pipeline.
"""

import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def process_raw_event(self, raw_event_id: str):
    """
    Pipeline stage 2: Normalize a raw event and forward to analytics.
    """
    from apps.tracking.models import RawEvent, IdentityMap
    from apps.analytics.models import Event

    try:
        raw = RawEvent.objects.select_related("tenant").get(id=raw_event_id)
    except RawEvent.DoesNotExist:
        logger.warning("RawEvent %s not found", raw_event_id)
        return

    try:
        # Identity resolution: try to attach a known customer via IdentityMap
        customer = raw.customer
        if not customer and raw.anonymous_id:
            identity = IdentityMap.objects.filter(
                tenant=raw.tenant, anonymous_id=raw.anonymous_id
            ).select_related("customer").first()
            if identity:
                customer = identity.customer
                raw.customer = customer

        # Normalize into the analytics Event model
        Event.objects.create(
            tenant=raw.tenant,
            customer=customer,
            event_type=raw.event_type,
            properties={**raw.properties, "_raw_id": str(raw.id)},
        )

        raw.status = RawEvent.STATUS_PROCESSED
        raw.processed_at = timezone.now()
        raw.save(update_fields=["status", "processed_at", "customer"])
    except Exception as exc:
        logger.exception("Failed to process raw event %s", raw_event_id)
        raw.status = RawEvent.STATUS_FAILED
        raw.error_message = str(exc)
        raw.save(update_fields=["status", "error_message"])
        raise self.retry(exc=exc, countdown=2 ** self.request.retries * 60)


@shared_task
def resolve_identity(identity_map_id: str):
    """
    Back-fill anonymous sessions/events when a new identity map is created.
    """
    from apps.tracking.models import IdentityMap, Session, RawEvent

    try:
        identity = IdentityMap.objects.select_related("customer", "tenant").get(id=identity_map_id)
    except IdentityMap.DoesNotExist:
        return

    # Update all unresolved sessions with this anonymous_id
    Session.objects.filter(
        tenant=identity.tenant,
        anonymous_id=identity.anonymous_id,
        is_identified=False,
    ).update(customer=identity.customer, is_identified=True)

    # Back-fill raw events
    RawEvent.objects.filter(
        tenant=identity.tenant,
        anonymous_id=identity.anonymous_id,
        customer__isnull=True,
    ).update(customer=identity.customer)

    logger.info("Identity resolved for anonymous_id=%s → customer=%s", identity.anonymous_id, identity.customer_id)
