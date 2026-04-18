"""
Insights generation tasks — anomaly detection, trend analysis, recommendations.
"""

import logging
from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


@shared_task
def generate_insights_for_tenant(tenant_id: str):
    """Run all active insight rules for a tenant."""
    from apps.insights.models import InsightRule
    from apps.tenants.models import Tenant

    try:
        tenant = Tenant.objects.get(id=tenant_id)
    except Tenant.DoesNotExist:
        return

    rules = InsightRule.objects.filter(tenant=tenant, is_active=True)
    for rule in rules:
        _run_rule.delay(str(rule.id))


@shared_task(bind=True, max_retries=2)
def _run_rule(self, rule_id: str):
    from apps.insights.models import InsightRule, Insight
    from apps.analytics.models import Metric

    try:
        rule = InsightRule.objects.select_related("tenant").get(id=rule_id)
    except InsightRule.DoesNotExist:
        return

    try:
        if rule.trigger_type == InsightRule.TRIGGER_THRESHOLD:
            _check_threshold(rule)
        elif rule.trigger_type == InsightRule.TRIGGER_ANOMALY:
            _check_anomaly(rule)
        elif rule.trigger_type == InsightRule.TRIGGER_SCHEDULED:
            _generate_trend_insight(rule)
    except Exception as exc:
        logger.exception("Insight rule %s failed", rule_id)
        raise self.retry(exc=exc)


def _check_threshold(rule):
    from apps.insights.models import Insight
    from apps.analytics.models import Metric

    if not rule.metric_key or rule.threshold_value is None:
        return

    latest = Metric.objects.filter(
        tenant=rule.tenant, name=rule.metric_key
    ).order_by("-period_start").first()

    if not latest:
        return

    if float(latest.value) >= rule.threshold_value:
        Insight.objects.create(
            tenant=rule.tenant,
            rule=rule,
            insight_type=Insight.TYPE_ANOMALY,
            priority=Insight.PRIORITY_HIGH,
            title=f"Threshold exceeded: {rule.metric_key}",
            summary=(
                f"Metric '{rule.metric_key}' reached {latest.value}, "
                f"exceeding threshold of {rule.threshold_value}."
            ),
            data_points={"metric": rule.metric_key, "value": float(latest.value), "threshold": rule.threshold_value},
            recommendation="Review current campaigns and audience targeting.",
        )


def _check_anomaly(rule):
    """Simplified statistical anomaly: flag if latest value > 2 std deviations."""
    from apps.insights.models import Insight
    from apps.analytics.models import Metric
    from django.db.models import Avg, StdDev

    if not rule.metric_key:
        return

    stats = Metric.objects.filter(
        tenant=rule.tenant, name=rule.metric_key
    ).aggregate(avg=Avg("value"), stddev=StdDev("value"))

    avg = stats["avg"]
    stddev = stats["stddev"]
    if avg is None or stddev is None or stddev == 0:
        return

    latest = Metric.objects.filter(
        tenant=rule.tenant, name=rule.metric_key
    ).order_by("-period_start").first()

    if not latest:
        return

    z_score = abs(float(latest.value) - float(avg)) / float(stddev)
    if z_score > 2:
        Insight.objects.create(
            tenant=rule.tenant,
            rule=rule,
            insight_type=Insight.TYPE_ANOMALY,
            priority=Insight.PRIORITY_HIGH,
            title=f"Anomaly detected in {rule.metric_key}",
            summary=f"Metric '{rule.metric_key}' showed an unusual value (z-score {z_score:.2f}).",
            data_points={"z_score": z_score, "value": float(latest.value), "avg": float(avg)},
        )


def _generate_trend_insight(rule):
    from apps.insights.models import Insight
    from apps.analytics.models import Metric

    if not rule.metric_key:
        return

    recent = list(
        Metric.objects.filter(tenant=rule.tenant, name=rule.metric_key)
        .order_by("-period_start")
        .values("value", "period_start")[:7]
    )

    if len(recent) < 2:
        return

    latest_val = float(recent[0]["value"])
    previous_val = float(recent[1]["value"])
    change_pct = ((latest_val - previous_val) / previous_val * 100) if previous_val else 0

    direction = "increased" if change_pct >= 0 else "decreased"
    Insight.objects.create(
        tenant=rule.tenant,
        rule=rule,
        insight_type=Insight.TYPE_TREND,
        priority=Insight.PRIORITY_MEDIUM,
        title=f"{rule.metric_key} {direction} by {abs(change_pct):.1f}%",
        summary=f"'{rule.metric_key}' {direction} {abs(change_pct):.1f}% compared to the previous period.",
        data_points={"recent": recent, "change_pct": change_pct},
    )
