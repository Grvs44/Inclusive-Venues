from decimal import Decimal, InvalidOperation
from rest_framework.exceptions import ValidationError
from rest_framework.filters import BaseFilterBackend
from django.db.models import Q


def split_params(arg: str) -> list[int]:
    result = []
    items = arg.split(',')
    for item in items:
        if item.isnumeric():
            result.append(int(item))
    return result


class CategoryFilter(BaseFilterBackend):
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


def get_location(location: str) -> tuple[Decimal, Decimal] | None:
    if location == '':
        return None
    lat, lon = location.split(',', 2)
    try:
        lat_d = Decimal(lat)
    except InvalidOperation as e:
        raise ValidationError('Latitude must be a number') from e
    try:
        lon_d = Decimal(lon)
    except InvalidOperation as e:
        raise ValidationError('Longitude must be a number') from e
    return lat_d, lon_d


class LocationFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        location = get_location(request.GET.get('location', ''))
        if location is None:
            return queryset
        radius = 2
        lat, lon = location
        km_lat = Decimal(0.00902) * radius
        km_lon = Decimal(0.00898) * radius
        lat_max = lat + km_lat
        lat_min = lat - km_lat
        lon_max = lon + km_lon
        lon_min = lon - km_lon
        print(lat_max,lon_max)
        print(lat_min,lon_min)
        return queryset.filter(
            latitude__lt=lat_max,
            latitude__gt=lat_min,
            longitude__lt=lon_max,
            longitude__gt=lon_min,
        )
