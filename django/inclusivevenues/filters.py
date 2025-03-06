from decimal import Decimal, InvalidOperation
from rest_framework.exceptions import ValidationError
from rest_framework.filters import BaseFilterBackend
from django.db.models import F, Func, Q


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
    try:
        lat, lon = location.split(',', 2)
    except ValueError as e:
        raise ValidationError(
            'Invalid coordinates: must be of the form (latitude, longitude)') from e
    try:
        lat_d = Decimal(lat)
    except InvalidOperation as e:
        raise ValidationError('Latitude must be a number') from e
    try:
        lon_d = Decimal(lon)
    except InvalidOperation as e:
        raise ValidationError('Longitude must be a number') from e
    return lat_d, lon_d


# Adapted from https://geoscience.blog/how-do-you-convert-latitude-and-longitude-to-kilometers/
LAT_KM = Decimal(110.574)
LON_KM = Decimal(70.1495605)


class LocationFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        location = get_location(request.GET.get('location', ''))
        if location is None:
            return queryset
        try:
            radius = Decimal(request.GET.get('radius', 1))
        except InvalidOperation as e:
            raise ValidationError('Radius must be a number') from e
        if radius <= 0:
            raise ValidationError('Radius must be a positive number')
        lat, lon = location

        return queryset.alias(lat_change=(F('latitude') - Decimal(lat)) * LAT_KM, lon_change=(F('longitude') - Decimal(lon)) * LON_KM)\
            .alias(distance=Func((F('lat_change')*F('lat_change')) + (F('lon_change')*F('lon_change')), function='SQRT'))\
            .order_by('distance')\
            .annotate(distance=F('distance'))
