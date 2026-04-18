"""
CRM models: Customer, Profile, Interaction, Preference, Score, LifecycleStage.
"""

import uuid
from django.conf import settings
from django.db import models


class Customer(models.Model):
    STATUS_LEAD = "lead"
    STATUS_PROSPECT = "prospect"
    STATUS_ACTIVE = "active"
    STATUS_CHURNED = "churned"
    STATUS_INACTIVE = "inactive"

    STATUS_CHOICES = [
        (STATUS_LEAD, "Lead"),
        (STATUS_PROSPECT, "Prospect"),
        (STATUS_ACTIVE, "Active"),
        (STATUS_CHURNED, "Churned"),
        (STATUS_INACTIVE, "Inactive"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="customers")
    email = models.EmailField(db_index=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    company = models.CharField(max_length=255, blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_LEAD, db_index=True)
    source = models.CharField(max_length=100, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_customers"
    )
    tags = models.JSONField(default=list)
    custom_fields = models.JSONField(default=dict)
    opted_in_email = models.BooleanField(default=True)
    opted_in_sms = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "crm_customers"
        unique_together = [["tenant", "email"]]
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["tenant", "status"]),
            models.Index(fields=["tenant", "email"]),
        ]

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>".strip()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email


class CustomerProfile(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name="profile")
    avatar_url = models.URLField(blank=True)
    website = models.URLField(blank=True)
    address = models.JSONField(default=dict)
    social_profiles = models.JSONField(default=dict)
    timezone = models.CharField(max_length=64, default="UTC")
    language = models.CharField(max_length=10, default="en")
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "crm_customer_profiles"

    def __str__(self):
        return f"Profile: {self.customer}"


class Interaction(models.Model):
    TYPE_EMAIL = "email"
    TYPE_CALL = "call"
    TYPE_MEETING = "meeting"
    TYPE_CHAT = "chat"
    TYPE_SMS = "sms"
    TYPE_NOTE = "note"
    TYPE_PURCHASE = "purchase"
    TYPE_SUPPORT = "support"

    TYPE_CHOICES = [
        (TYPE_EMAIL, "Email"),
        (TYPE_CALL, "Call"),
        (TYPE_MEETING, "Meeting"),
        (TYPE_CHAT, "Chat"),
        (TYPE_SMS, "SMS"),
        (TYPE_NOTE, "Note"),
        (TYPE_PURCHASE, "Purchase"),
        (TYPE_SUPPORT, "Support"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="interactions")
    interaction_type = models.CharField(max_length=30, choices=TYPE_CHOICES, db_index=True)
    subject = models.CharField(max_length=500, blank=True)
    body = models.TextField(blank=True)
    direction = models.CharField(max_length=10, choices=[("inbound", "Inbound"), ("outbound", "Outbound")], default="outbound")
    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    metadata = models.JSONField(default=dict)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "crm_interactions"
        ordering = ["-occurred_at"]
        indexes = [models.Index(fields=["customer", "-occurred_at"])]

    def __str__(self):
        return f"{self.interaction_type} with {self.customer}"


class Preference(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name="preferences")
    communication_channels = models.JSONField(default=list)
    frequency = models.CharField(max_length=20, default="weekly")
    interests = models.JSONField(default=list)
    product_categories = models.JSONField(default=list)
    do_not_contact = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "crm_preferences"

    def __str__(self):
        return f"Preferences: {self.customer}"


class Score(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE, related_name="score")
    engagement_score = models.FloatField(default=0.0)
    lead_score = models.FloatField(default=0.0)
    churn_risk_score = models.FloatField(default=0.0)
    lifetime_value = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    predicted_ltv = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    recency_days = models.IntegerField(default=0)
    frequency_count = models.IntegerField(default=0)
    monetary_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "crm_scores"

    def __str__(self):
        return f"Scores: {self.customer}"


class LifecycleStage(models.Model):
    STAGE_AWARENESS = "awareness"
    STAGE_CONSIDERATION = "consideration"
    STAGE_PURCHASE = "purchase"
    STAGE_RETENTION = "retention"
    STAGE_ADVOCACY = "advocacy"

    STAGE_CHOICES = [
        (STAGE_AWARENESS, "Awareness"),
        (STAGE_CONSIDERATION, "Consideration"),
        (STAGE_PURCHASE, "Purchase"),
        (STAGE_RETENTION, "Retention"),
        (STAGE_ADVOCACY, "Advocacy"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="lifecycle_stages")
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, db_index=True)
    entered_at = models.DateTimeField(auto_now_add=True)
    exited_at = models.DateTimeField(null=True, blank=True)
    is_current = models.BooleanField(default=True)
    trigger = models.CharField(max_length=200, blank=True)

    class Meta:
        db_table = "crm_lifecycle_stages"
        ordering = ["-entered_at"]

    def __str__(self):
        return f"{self.customer} → {self.stage}"
