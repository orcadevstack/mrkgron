"""
Segments models: Segment, SegmentRule, SegmentMembership.
"""

import uuid
from django.conf import settings
from django.db import models


class Segment(models.Model):
    TYPE_STATIC = "static"
    TYPE_DYNAMIC = "dynamic"

    TYPE_CHOICES = [
        (TYPE_STATIC, "Static"),
        (TYPE_DYNAMIC, "Dynamic"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="segments")
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    segment_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_DYNAMIC)
    filter_conditions = models.JSONField(default=dict)
    members = models.ManyToManyField(
        "crm.Customer",
        through="SegmentMembership",
        related_name="segments",
        blank=True,
    )
    member_count = models.PositiveIntegerField(default=0)
    auto_refresh = models.BooleanField(default=True)
    last_refreshed_at = models.DateTimeField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "segments"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class SegmentRule(models.Model):
    OPERATOR_AND = "and"
    OPERATOR_OR = "or"

    OPERATOR_CHOICES = [
        (OPERATOR_AND, "AND"),
        (OPERATOR_OR, "OR"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE, related_name="rules")
    field = models.CharField(max_length=200)
    operator = models.CharField(max_length=50)
    value = models.JSONField()
    logical_operator = models.CharField(max_length=10, choices=OPERATOR_CHOICES, default=OPERATOR_AND)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "segment_rules"
        ordering = ["order"]

    def __str__(self):
        return f"{self.field} {self.operator} {self.value}"


class SegmentMembership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    segment = models.ForeignKey(Segment, on_delete=models.CASCADE)
    customer = models.ForeignKey("crm.Customer", on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    added_via = models.CharField(max_length=50, default="auto")

    class Meta:
        db_table = "segment_memberships"
        unique_together = [["segment", "customer"]]

    def __str__(self):
        return f"{self.customer} in {self.segment}"
