"""
Analytics Celery tasks.
"""

import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def generate_report(self, report_id: str):
    from apps.analytics.models import Report, Event
    from django.db.models import Count

    try:
        report = Report.objects.get(id=report_id)
    except Report.DoesNotExist:
        return

    report.status = Report.STATUS_RUNNING
    report.save(update_fields=["status"])

    try:
        config = report.query_config
        event_name = config.get("event_name")
        group_by = config.get("group_by", "event_name")

        qs = Event.objects.filter(tenant=report.tenant)
        if event_name:
            qs = qs.filter(event_name=event_name)

        data = list(qs.values(group_by).annotate(count=Count("id")).order_by("-count")[:1000])
        report.result_data = {"rows": data}
        report.status = Report.STATUS_COMPLETED
        report.completed_at = timezone.now()
    except Exception as exc:
        logger.exception("Report %s failed", report_id)
        report.status = Report.STATUS_FAILED
        report.error_message = str(exc)

    report.save(update_fields=["status", "result_data", "completed_at", "error_message"])


@shared_task(bind=True)
def train_forecast_model(self, model_id: str):
    from apps.analytics.models import ForecastModel

    try:
        fm = ForecastModel.objects.get(id=model_id)
    except ForecastModel.DoesNotExist:
        return

    # Placeholder: real ML training would go here
    fm.last_trained_at = timezone.now()
    fm.accuracy_score = 0.85
    fm.predictions = []
    fm.save(update_fields=["last_trained_at", "accuracy_score", "predictions"])
    logger.info("ForecastModel %s trained", model_id)


@shared_task
def compute_daily_metrics():
    """
    Periodic task: compute daily metric aggregations for all tenants.
    """
    from apps.tenants.models import Tenant
    from apps.analytics.models import Metric, Event
    from django.db.models import Count
    from django.utils import timezone
    import datetime

    today = timezone.now().date()
    period_start = timezone.make_aware(datetime.datetime.combine(today, datetime.time.min))
    period_end = timezone.make_aware(datetime.datetime.combine(today, datetime.time.max))

    for tenant in Tenant.objects.filter(is_active=True):
        event_counts = (
            Event.objects.filter(tenant=tenant, occurred_at__range=(period_start, period_end))
            .values("event_name")
            .annotate(count=Count("id"))
        )
        for row in event_counts:
            Metric.objects.update_or_create(
                tenant=tenant,
                name=f"daily_{row['event_name']}",
                period=Metric.PERIOD_DAILY,
                period_start=period_start,
                defaults={
                    "event_name": row["event_name"],
                    "aggregation": Metric.AGGREGATION_COUNT,
                    "value": row["count"],
                    "period_end": period_end,
                },
            )
