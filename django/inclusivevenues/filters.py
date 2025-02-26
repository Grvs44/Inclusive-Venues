from django_filters.filters import ModelMultipleChoiceField
from django_filters.filterset import FilterSet

from . import models


class VenueFilterSet(FilterSet):
    subcategory__category = ModelMultipleChoiceField(
        to_field_name='category', queryset=models.VenueCategory.objects.all())
    subcategory = ModelMultipleChoiceField(
        queryset=models.VenueSubcategory.objects.all())

    class Meta:
        model = models.Venue
        fields = ['subcategory__category', 'subcategory']
