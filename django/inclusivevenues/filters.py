from rest_framework.filters import BaseFilterBackend
from django.db.models import Q


def split_params(arg: str) -> list[int]:
    result = []
    items = arg.split(',')
    for item in items:
        if item.isnumeric():
            result.append(int(item))
    return result


class VenueFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        categories = split_params(request.GET.get('category', ''))
        subcategories = split_params(request.GET.get('subcategory', ''))
        if not categories and not subcategories:
            return queryset
        if categories and subcategories:
            return queryset.filter(Q(subcategory__category__in=categories) | Q(subcategory__in=subcategories))
        if categories:
            return queryset.filter(subcategory__category__in=categories)
        return queryset.filter(subcategory__in=subcategories)
