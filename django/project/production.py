'''
Settings for the production app hosted by Azure
Adapted from https://github.com/Azure-Samples/msdocs-django-postgresql-sample-app/blob/starter-no-infra/azureproject/production.py
'''
import os

from .settings import *  # noqa

# Configure the domain name using the environment variable
# that Azure automatically creates for us.
ALLOWED_HOSTS = [os.environ['WEBSITE_HOSTNAME']
                 ] if 'WEBSITE_HOSTNAME' in os.environ else []
CSRF_TRUSTED_ORIGINS = ['https://' + os.environ['WEBSITE_HOSTNAME']
                        ] if 'WEBSITE_HOSTNAME' in os.environ else []
DEBUG = 'DEBUG' in os.environ

SECRET_KEY = os.getenv('SECRET_KEY')

INSTALLED_APPS.append('storages')

# WhiteNoise configuration
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Adapted from https://medium.com/@hellenwain_54279/uploading-django-static-and-media-files-to-azure-blob-storage-9f5e1e33725f
AZURE_ACCOUNT_NAME = 'inclusivevenues'
AZURE_ACCOUNT_KEY = os.getenv('AZURE_STORAGE_KEY')
AZURE_CONNECTION_STRING = os.getenv('AZURE_STORAGE_CONNECTION')
STATIC_ROOT = 'https://inclusivevenues.file.core.windows.net/media/'
MEDIA_URL = 'https://inclusivevenues.file.core.windows.net/media/'
STORAGES = {
    'default': {
        'BACKEND': 'storages.backends.azure_storage.AzureStorage',
        'OPTIONS': {
            'azure_container': 'media',
            'account_name': AZURE_ACCOUNT_NAME,
            'account_key': AZURE_ACCOUNT_KEY,
            'connection_string': AZURE_CONNECTION_STRING,
        },
    },
    'staticfiles': {
        'BACKEND': 'storages.backends.azure_storage.AzureStorage',
        'OPTIONS': {
            'azure_container': 'static',
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
