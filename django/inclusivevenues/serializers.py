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


class VenueImageSerializer(ModelSerializer):
    class Meta:
        model = models.Image
        fields = ['id', 'alt', 'src']
        # TODO: order by order


class VenueSerializer(ModelSerializer):
    images = VenueImageSerializer(many=True, read_only=True)

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
            'score',
            'images',
        ]


class VenueListSerializer(ModelSerializer):
    class Meta:
        model = models.Venue
        fields = [
            'id',
            'name',
            'longitude',
            'latitude',
            'subcategory',
            'score',
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


class ImageSerializer(ModelSerializer):
    class Meta:
        model = models.Image
        fields = ['id', 'venue', 'order', 'alt', 'src']
