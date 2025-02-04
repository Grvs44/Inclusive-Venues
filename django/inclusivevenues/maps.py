from decimal import Decimal
import requests

from django.conf import settings


def get_image(latitude: Decimal, longitude: Decimal):
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
    f = open('image.png', 'wb')
    f.write(response.content)
    f.close()
    return response
