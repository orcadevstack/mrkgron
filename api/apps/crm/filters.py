import django_filters
from .models import Customer, Interaction


class CustomerFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status")
    source = django_filters.CharFilter(field_name="source", lookup_expr="icontains")
    company = django_filters.CharFilter(field_name="company", lookup_expr="icontains")
    created_after = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="gte")
    created_before = django_filters.DateTimeFilter(field_name="created_at", lookup_expr="lte")
    opted_in_email = django_filters.BooleanFilter(field_name="opted_in_email")
    assigned_to = django_filters.UUIDFilter(field_name="assigned_to__id")

    class Meta:
        model = Customer
        fields = ["status", "source", "company", "opted_in_email", "assigned_to"]


class InteractionFilter(django_filters.FilterSet):
    interaction_type = django_filters.CharFilter(field_name="interaction_type")
    direction = django_filters.CharFilter(field_name="direction")
    after = django_filters.DateTimeFilter(field_name="occurred_at", lookup_expr="gte")
    before = django_filters.DateTimeFilter(field_name="occurred_at", lookup_expr="lte")

    class Meta:
        model = Interaction
        fields = ["interaction_type", "direction"]
