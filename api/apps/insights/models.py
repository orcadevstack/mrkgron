"""
Insights models — AI/ML-generated business intelligence.
"""

import uuid
from django.conf import settings
from django.db import models


class InsightRule(models.Model):
    """
    Configurable rule that defines WHEN and HOW an insight is generated.
    """

    TRIGGER_SCHEDULED = "scheduled"
    TRIGGER_THRESHOLD = "threshold"
    TRIGGER_ANOMALY = "anomaly"
    TRIGGER_MANUAL = "manual"

    TRIGGER_CHOICES = [
        (TRIGGER_SCHEDULED, "Scheduled"),
        (TRIGGER_THRESHOLD, "Threshold Crossed"),
        (TRIGGER_ANOMALY, "Anomaly Detected"),
        (TRIGGER_MANUAL, "Manual"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="insight_rules")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    trigger_type = models.CharField(max_length=30, choices=TRIGGER_CHOICES, default=TRIGGER_SCHEDULED)
    metric_key = models.CharField(max_length=128, blank=True)
    threshold_value = models.FloatField(null=True, blank=True)
    query_config = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "insights_rules"

    def __str__(self):
        return self.name


class Insight(models.Model):
    """
    A single generated insight — summary, recommendation, or anomaly alert.
    """

    TYPE_TREND = "trend"
    TYPE_ANOMALY = "anomaly"
    TYPE_RECOMMENDATION = "recommendation"
    TYPE_FORECAST = "forecast"
    TYPE_COHORT = "cohort"
    TYPE_FUNNEL = "funnel"

    TYPE_CHOICES = [
        (TYPE_TREND, "Trend"),
        (TYPE_ANOMALY, "Anomaly"),
        (TYPE_RECOMMENDATION, "Recommendation"),
        (TYPE_FORECAST, "Forecast"),
        (TYPE_COHORT, "Cohort"),
        (TYPE_FUNNEL, "Funnel"),
    ]

    PRIORITY_LOW = "low"
    PRIORITY_MEDIUM = "medium"
    PRIORITY_HIGH = "high"
    PRIORITY_CRITICAL = "critical"

    PRIORITY_CHOICES = [
        (PRIORITY_LOW, "Low"),
        (PRIORITY_MEDIUM, "Medium"),
        (PRIORITY_HIGH, "High"),
        (PRIORITY_CRITICAL, "Critical"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="insights")
    rule = models.ForeignKey(InsightRule, on_delete=models.SET_NULL, null=True, blank=True, related_name="insights")
    insight_type = models.CharField(max_length=30, choices=TYPE_CHOICES, db_index=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM, db_index=True)
    title = models.CharField(max_length=512)
    summary = models.TextField()
    data_points = models.JSONField(default=dict)
    recommendation = models.TextField(blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    is_dismissed = models.BooleanField(default=False)
    generated_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "insights"
        ordering = ["-generated_at"]
        indexes = [
            models.Index(fields=["tenant", "is_read", "is_dismissed"]),
            models.Index(fields=["insight_type", "priority"]),
        ]

    def __str__(self):
        return f"[{self.priority.upper()}] {self.title}"
