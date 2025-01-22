# Adapted from https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
from rest_framework.serializers import ModelSerializer
from . import models


class VenueCategorySerializer(ModelSerializer):
    class Meta:
        model = models.VenueCategory
        fields = ['id', 'name']


class VenueSubcategorySerializer(ModelSerializer):
    class Meta:
        model = models.VenueSubcategory
        fields = ['id', 'name', 'category']


class VenueSerializer(ModelSerializer):
    class Meta:
        model = models.Venue
        fields = [
            'id',
            'name',
            'description',
            'longitude',
            'latitude',
            'address',
            'subcategory',
        ]


class ReviewSerializer(ModelSerializer):
    class Meta:
        model = models.Review
        fields = ['id', 'author', 'venue', 'body']


class RatingCategorySerializer(ModelSerializer):
    class Meta:
        model = models.RatingCategory
        fields = ['id', 'name', 'description']


class RatingSerializer(ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ['id', 'category', 'review', 'value']
