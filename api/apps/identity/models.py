"""
Identity models — canonical identity resolution and profile merging.

IdentityProfile is the authoritative, merged representation of a customer.
Multiple IdentityAlias entries point to a single IdentityProfile.
MergeEvent provides a full audit trail of every merge operation.
"""

import uuid
from django.conf import settings
from django.db import models


class IdentityProfile(models.Model):
    """The canonical merged identity for a contact across all channels."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="identity_profiles")

    # Link to the canonical CRM contact when resolved
    customer = models.OneToOneField(
        "crm.CustomerProfile",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="identity_profile",
    )

    # Best-known identifiers (denormalised for fast lookup)
    primary_email = models.EmailField(blank=True, db_index=True)
    primary_phone = models.CharField(max_length=30, blank=True, db_index=True)

    # Aggregated traits from all aliases
    traits = models.JSONField(default=dict)

    is_anonymous = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "identity_profiles"
        indexes = [
            models.Index(fields=["tenant", "primary_email"]),
            models.Index(fields=["tenant", "primary_phone"]),
        ]

    def __str__(self):
        if self.primary_email:
            return self.primary_email
        return str(self.id)


class IdentityAlias(models.Model):
    """A single identifier that links to an IdentityProfile (many-to-one)."""

    ALIAS_EMAIL = "email"
    ALIAS_PHONE = "phone"
    ALIAS_DEVICE = "device"
    ALIAS_COOKIE = "cookie"
    ALIAS_USER_ID = "user_id"
    ALIAS_EXTERNAL = "external"

    ALIAS_TYPE_CHOICES = [
        (ALIAS_EMAIL, "Email"),
        (ALIAS_PHONE, "Phone"),
        (ALIAS_DEVICE, "Device ID"),
        (ALIAS_COOKIE, "Cookie / Anonymous ID"),
        (ALIAS_USER_ID, "Internal User ID"),
        (ALIAS_EXTERNAL, "External ID"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    profile = models.ForeignKey(IdentityProfile, on_delete=models.CASCADE, related_name="aliases")
    alias_type = models.CharField(max_length=20, choices=ALIAS_TYPE_CHOICES, db_index=True)
    alias_value = models.CharField(max_length=512, db_index=True)
    source = models.CharField(max_length=128, blank=True, help_text="Origin system/channel")
    confidence = models.FloatField(default=1.0, help_text="Match confidence 0–1")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "identity_aliases"
        unique_together = [["profile", "alias_type", "alias_value"]]

    def __str__(self):
        return f"{self.alias_type}:{self.alias_value}"


class MergeEvent(models.Model):
    """Audit log recording when two IdentityProfiles were merged."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey("tenants.Tenant", on_delete=models.CASCADE, related_name="merge_events")

    # Source profile absorbed into target
    source_profile_id = models.UUIDField(db_index=True)
    target_profile = models.ForeignKey(
        IdentityProfile,
        on_delete=models.SET_NULL,
        null=True,
        related_name="received_merges",
    )

    merged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="User who triggered the merge; null if automated",
    )
    reason = models.CharField(max_length=255, blank=True)
    metadata = models.JSONField(default=dict)
    merged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "identity_merge_events"
        ordering = ["-merged_at"]

    def __str__(self):
        return f"Merge {self.source_profile_id} → {self.target_profile_id}"
