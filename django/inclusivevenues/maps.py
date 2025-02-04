from decimal import Decimal
import uuid
import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage


def get_image(latitude: Decimal, longitude: Decimal):
    '''Download map preview image from coordinates'''
    map_key = getattr(settings, 'AZURE_MAP_KEY')
    if map_key is None:
        raise AttributeError('AZURE_MAP_KEY setting not initialised')
    headers = {
        'subscription-key': map_key
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


def save_image(image: bytes):
    '''Save map preview image to storage'''
    return default_storage.save(f'{uuid.uuid4()}.png', ContentFile(image))


def get_image_url(latitude: Decimal, longitude: Decimal):
    '''Download map preview image from coordinates and save to storage'''
    image = get_image(latitude, longitude)
    return save_image(image)
