from decimal import Decimal, InvalidOperation
import re
import requests
from rest_framework.exceptions import ValidationError
from rest_framework.filters import BaseFilterBackend
from django.db.models import F, Func, Q, QuerySet

from .settings import MAP_KEY

postcode_pattern = re.compile('[A-Z][A-Z][0-9][0-9]?[ ]?[0-9][A-Z][A-Z]')


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
    coords = get_coordinates(location)
    if coords is not None:
        return coords
    location = location.upper()
    if postcode_pattern.match(location):
        return get_postcode_coordinates(location)
    else:
        raise ValidationError(
            'Invalid location: must be coordinates (latitude,longitude) or a postcode')


def get_coordinates(location: str) -> tuple[Decimal, Decimal] | None:
    try:
        lat, lon = location.split(',', 2)
        lat_d = Decimal(lat)
        lon_d = Decimal(lon)
    except (ValueError, InvalidOperation):
        return None
    return lat_d, lon_d


def get_postcode_coordinates(location: str) -> tuple[Decimal, Decimal]:
    if MAP_KEY is None:
        raise ValidationError(
            'Search by postcode is unavailable (missing Azure Maps key)')
    params = {
        'subscription-key': MAP_KEY,
        'api-version': '1.0',
        'language': 'en-GB',
        'query': location,
    }
    response = requests.get(
        'https://atlas.microsoft.com/search/address/json', params=params, timeout=20)
    results = response.json().get('results', [])
    if results == []:
        lat = lon = None
    else:
        coords = results[0].get('position', {})
        lat = coords.get('lat', None)
        lon = coords.get('lon', None)
    if lat is None or lon is None:
        raise ValidationError("Couldn't retrieve location from postcode")
    return Decimal(lat), Decimal(lon)


# Adapted from https://geoscience.blog/how-do-you-convert-latitude-and-longitude-to-kilometers/
LAT_KM = Decimal(110.574)
LON_KM = Decimal(70.1495605)


class LocationFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset: QuerySet, view):
        location = get_location(request.GET.get('location', ''))
        if location is None:
            return queryset
        lat, lon = location

        return queryset.alias(lat_change=(F('latitude') - Decimal(lat)) * LAT_KM, lon_change=(F('longitude') - Decimal(lon)) * LON_KM)\
            .alias(distance=Func((F('lat_change')*F('lat_change')) + (F('lon_change')*F('lon_change')), function='SQRT'))\
            .order_by('distance')\
            .annotate(distance=F('distance'))


class CreatorFilter(BaseFilterBackend):
    def filter_queryset(self, request, queryset: QuerySet, view):
        if request.GET.get('my', None) is None:
            return queryset
        if request.user.is_authenticated:
            return queryset.filter(added_by=request.user)
        return queryset.none()
