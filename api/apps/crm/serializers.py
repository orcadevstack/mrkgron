from rest_framework import serializers
from .models import Customer, CustomerProfile, Interaction, Preference, Score, LifecycleStage


class CustomerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerProfile
        fields = ["avatar_url", "website", "address", "social_profiles", "timezone", "language", "date_of_birth", "gender", "notes", "updated_at"]
        read_only_fields = ["updated_at"]


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ["engagement_score", "lead_score", "churn_risk_score", "lifetime_value", "predicted_ltv", "recency_days", "frequency_count", "monetary_total", "updated_at"]
        read_only_fields = fields


class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    profile = CustomerProfileSerializer(read_only=True)
    score = ScoreSerializer(read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id", "email", "first_name", "last_name", "full_name", "phone",
            "company", "job_title", "status", "source", "assigned_to", "tags",
            "custom_fields", "opted_in_email", "opted_in_sms",
            "profile", "score", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CustomerWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "email", "first_name", "last_name", "phone", "company", "job_title",
            "status", "source", "assigned_to", "tags", "custom_fields",
            "opted_in_email", "opted_in_sms",
        ]

    def create(self, validated_data):
        customer = super().create(validated_data)
        CustomerProfile.objects.create(customer=customer)
        Score.objects.create(customer=customer)
        Preference.objects.create(customer=customer)
        return customer


class InteractionSerializer(serializers.ModelSerializer):
    performed_by_name = serializers.CharField(source="performed_by.full_name", read_only=True)

    class Meta:
        model = Interaction
        fields = [
            "id", "customer", "interaction_type", "subject", "body",
            "direction", "performed_by", "performed_by_name", "metadata", "occurred_at",
        ]
        read_only_fields = ["id", "occurred_at"]


class PreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Preference
        fields = ["communication_channels", "frequency", "interests", "product_categories", "do_not_contact", "updated_at"]
        read_only_fields = ["updated_at"]


class LifecycleStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifecycleStage
        fields = ["id", "stage", "entered_at", "exited_at", "is_current", "trigger"]
        read_only_fields = ["id", "entered_at"]
