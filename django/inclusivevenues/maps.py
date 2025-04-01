'''
Module for fetching and storing map preview images.
Documentation for downloading map static image:
https://learn.microsoft.com/en-us/rest/api/maps/render/get-map-static-image
'''
from decimal import Decimal
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

from .settings import MAP_KEY


def get_map_image(latitude: Decimal, longitude: Decimal):
    '''Download map preview image from coordinates'''
    if MAP_KEY is None:
        return None
    headers = {
        'subscription-key': MAP_KEY
    }
    params = {
        'api-version': '2024-04-01',
        'center': f'{longitude},{latitude}',
        'pins': f'default||{longitude} {latitude}',
        'height': '480',
        'width': '480',
        'zoom': 14,
    }
    response = requests.get(
        'https://atlas.microsoft.com/map/static',
        headers=headers,
        params=params,
        timeout=20,
    )
    return response.content


def save_map_image(image: bytes, latitude, longitude):
    '''Save map preview image to storage'''
# Adapted from https://docs.djangoproject.com/en/5.1/topics/files/#storage-objects
    return default_storage.save(f'{latitude}{longitude}.png', ContentFile(image))


def get_map_image_url(latitude: Decimal, longitude: Decimal):
    '''Download map preview image from coordinates and save to storage'''
    image = get_map_image(latitude, longitude)
    return None if image is None else save_map_image(image, latitude, longitude)
