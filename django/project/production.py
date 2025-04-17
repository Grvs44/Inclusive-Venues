'''
Settings for the production app hosted by Azure
Adapted from https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app/blob/starter-no-infra/azureproject/production.py
'''
import os

from .settings import *

ALLOWED_HOSTS = []
CSRF_TRUSTED_ORIGINS = []
if 'STATICAPP_URL' in os.environ:
    ALLOWED_HOSTS.append(os.environ['STATICAPP_URL'])
    CSRF_TRUSTED_ORIGINS.append('https://' + os.environ['STATICAPP_URL'])
if 'APPSERVICE_URL' in os.environ:
    ALLOWED_HOSTS.append(os.environ['APPSERVICE_URL'])
    CSRF_TRUSTED_ORIGINS.append('https://' + os.environ['APPSERVICE_URL'])
elif 'WEBSITE_HOSTNAME' in os.environ:
    ALLOWED_HOSTS.append(os.environ['WEBSITE_HOSTNAME'])
    CSRF_TRUSTED_ORIGINS.append('https://' + os.environ['WEBSITE_HOSTNAME'])
DEBUG = 'DEBUG' in os.environ

SECRET_KEY = os.getenv('SECRET_KEY')

INSTALLED_APPS.append('storages')

# Adapted from https://medium.com/@hellenwain_54279/uploading-django-static-and-media-files-to-azure-blob-storage-9f5e1e33725f
AZURE_ACCOUNT_NAME = os.getenv('AZURE_STORAGE_NAME')
AZURE_ACCOUNT_KEY = os.getenv('AZURE_STORAGE_KEY')
AZURE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION')
STATIC_ROOT = os.getenv('STATIC_ROOT')
MEDIA_URL = os.getenv('MEDIA_URL')
STORAGES = {
    'default': {
        'BACKEND': 'storages.backends.azure_storage.AzureStorage',
        'OPTIONS': {
            'azure_container': os.getenv('AZURE_MEDIA_CONTAINER'),
            'account_name': AZURE_ACCOUNT_NAME,
            'account_key': AZURE_ACCOUNT_KEY,
            'connection_string': AZURE_CONNECTION_STRING,
        },
    },
    'staticfiles': {
        'BACKEND': 'storages.backends.azure_storage.AzureStorage',
        'OPTIONS': {
            'azure_container': os.getenv('AZURE_STATIC_CONTAINER'),
            'account_name': AZURE_ACCOUNT_NAME,
            'account_key': AZURE_ACCOUNT_KEY,
            'connection_string': AZURE_CONNECTION_STRING,
        }
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.cache'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/home/site/db.sqlite3',
    }
}
