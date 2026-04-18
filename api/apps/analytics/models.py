"""
Analytics models: Event, Metric, Dashboard, Widget, Report, ForecastModel.
"""

import uuid
from django.conf import settings
from django.db import models


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="events")
    customer = models.ForeignKey(
        "crm.Customer", on_delete=models.SET_NULL, null=True, blank=True, related_name="events"
    )
    anonymous_id = models.CharField(max_length=255, blank=True, db_index=True)
    session_id = models.CharField(max_length=255, blank=True)
    event_name = models.CharField(max_length=255, db_index=True)
    category = models.CharField(max_length=100, blank=True, db_index=True)
    properties = models.JSONField(default=dict)
    context = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    referrer = models.URLField(blank=True)
    url = models.URLField(blank=True)
    occurred_at = models.DateTimeField(db_index=True)
    ingested_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_events"
        ordering = ["-occurred_at"]
        indexes = [
            models.Index(fields=["tenant", "event_name", "-occurred_at"]),
            models.Index(fields=["tenant", "category", "-occurred_at"]),
        ]

    def __str__(self):
        return f"{self.event_name} at {self.occurred_at}"


class Metric(models.Model):
    AGGREGATION_COUNT = "count"
    AGGREGATION_SUM = "sum"
    AGGREGATION_AVG = "avg"
    AGGREGATION_MIN = "min"
    AGGREGATION_MAX = "max"
    AGGREGATION_UNIQUE = "unique"

    AGGREGATION_CHOICES = [
        (AGGREGATION_COUNT, "Count"),
        (AGGREGATION_SUM, "Sum"),
        (AGGREGATION_AVG, "Average"),
        (AGGREGATION_MIN, "Minimum"),
        (AGGREGATION_MAX, "Maximum"),
        (AGGREGATION_UNIQUE, "Unique Count"),
    ]

    PERIOD_HOURLY = "hourly"
    PERIOD_DAILY = "daily"
    PERIOD_WEEKLY = "weekly"
    PERIOD_MONTHLY = "monthly"

    PERIOD_CHOICES = [
        (PERIOD_HOURLY, "Hourly"),
        (PERIOD_DAILY, "Daily"),
        (PERIOD_WEEKLY, "Weekly"),
        (PERIOD_MONTHLY, "Monthly"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="metrics")
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    event_name = models.CharField(max_length=255)
    aggregation = models.CharField(max_length=20, choices=AGGREGATION_CHOICES, default=AGGREGATION_COUNT)
    field = models.CharField(max_length=200, blank=True)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default=PERIOD_DAILY)
    filters = models.JSONField(default=dict)
    value = models.FloatField(default=0)
    period_start = models.DateTimeField(null=True, blank=True)
    period_end = models.DateTimeField(null=True, blank=True)
    computed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "analytics_metrics"
        ordering = ["-computed_at"]

    def __str__(self):
        return f"{self.name} ({self.aggregation})"


class Dashboard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="dashboards")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_default = models.BooleanField(default=False)
    layout = models.JSONField(default=list)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "analytics_dashboards"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Widget(models.Model):
    TYPE_LINE = "line"
    TYPE_BAR = "bar"
    TYPE_PIE = "pie"
    TYPE_METRIC = "metric"
    TYPE_TABLE = "table"
    TYPE_FUNNEL = "funnel"
    TYPE_COHORT = "cohort"

    TYPE_CHOICES = [
        (TYPE_LINE, "Line Chart"),
        (TYPE_BAR, "Bar Chart"),
        (TYPE_PIE, "Pie Chart"),
        (TYPE_METRIC, "Metric Card"),
        (TYPE_TABLE, "Table"),
        (TYPE_FUNNEL, "Funnel"),
        (TYPE_COHORT, "Cohort"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name="widgets")
    title = models.CharField(max_length=255)
    widget_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    config = models.JSONField(default=dict)
    position_x = models.IntegerField(default=0)
    position_y = models.IntegerField(default=0)
    width = models.IntegerField(default=4)
    height = models.IntegerField(default=3)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_widgets"
        ordering = ["position_y", "position_x"]

    def __str__(self):
        return f"{self.title} ({self.widget_type})"


class Report(models.Model):
    STATUS_PENDING = "pending"
    STATUS_RUNNING = "running"
    STATUS_COMPLETED = "completed"
    STATUS_FAILED = "failed"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_RUNNING, "Running"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_FAILED, "Failed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="reports")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    query_config = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    result_data = models.JSONField(default=dict)
    result_file = models.FileField(upload_to="reports/", null=True, blank=True)
    error_message = models.TextField(blank=True)
    scheduled = models.BooleanField(default=False)
    schedule_config = models.JSONField(default=dict)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "analytics_reports"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class ForecastModel(models.Model):
    TYPE_REVENUE = "revenue"
    TYPE_CHURN = "churn"
    TYPE_LTV = "ltv"
    TYPE_DEMAND = "demand"

    TYPE_CHOICES = [
        (TYPE_REVENUE, "Revenue Forecast"),
        (TYPE_CHURN, "Churn Prediction"),
        (TYPE_LTV, "Lifetime Value"),
        (TYPE_DEMAND, "Demand Forecast"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="forecast_models")
    name = models.CharField(max_length=255)
    model_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    config = models.JSONField(default=dict)
    last_trained_at = models.DateTimeField(null=True, blank=True)
    accuracy_score = models.FloatField(null=True, blank=True)
    predictions = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "analytics_forecast_models"

    def __str__(self):
        return f"{self.name} ({self.model_type})"
