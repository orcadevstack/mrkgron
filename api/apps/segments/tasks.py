"""
Celery tasks for Segments.
"""

import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def refresh_segment(self, segment_id: str):
    """
    Re-evaluate all dynamic segment rules and update membership.
    """
    from apps.segments.models import Segment, SegmentMembership
    from apps.crm.models import Customer
    from django.utils import timezone

    try:
        segment = Segment.objects.get(id=segment_id)
    except Segment.DoesNotExist:
        logger.error("Segment %s not found", segment_id)
        return

    if segment.segment_type != Segment.TYPE_DYNAMIC:
        return

    # Simple rule evaluator: filter by conditions stored in filter_conditions
    conditions = segment.filter_conditions
    qs = Customer.objects.filter(tenant=segment.tenant)

    status_filter = conditions.get("status")
    if status_filter:
        qs = qs.filter(status=status_filter)

    source_filter = conditions.get("source")
    if source_filter:
        qs = qs.filter(source__icontains=source_filter)

    opted_in_email = conditions.get("opted_in_email")
    if opted_in_email is not None:
        qs = qs.filter(opted_in_email=opted_in_email)

    matching_ids = set(qs.values_list("id", flat=True))

    # Remove members that no longer match
    SegmentMembership.objects.filter(segment=segment).exclude(customer_id__in=matching_ids).delete()

    # Add new matching members
    existing_ids = set(SegmentMembership.objects.filter(segment=segment).values_list("customer_id", flat=True))
    new_ids = matching_ids - existing_ids
    SegmentMembership.objects.bulk_create(
        [SegmentMembership(segment=segment, customer_id=cid, added_via="auto") for cid in new_ids],
        ignore_conflicts=True,
    )

    segment.member_count = segment.members.count()
    segment.last_refreshed_at = timezone.now()
    segment.save(update_fields=["member_count", "last_refreshed_at"])

    logger.info("Segment %s refreshed — %d members", segment_id, segment.member_count)
