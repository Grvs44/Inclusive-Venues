# Adapted from https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
# pylint:disable=no-member
from rest_framework.serializers import ModelSerializer, CharField
from django.db.transaction import atomic
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
            'map',
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


class RatingListSerializer(ModelSerializer):
    category = CharField(source='category.name', read_only=True)

    class Meta:
        model = models.Rating
        fields = ['category', 'value']


class ReviewRatingListSerializer(ModelSerializer):
    class Meta:
        model = models.Rating
        fields = ['category', 'value']


class CreateReviewSerializer(ModelSerializer):
    venueName = CharField(source='venue.name', read_only=True)
    ratings = ReviewRatingListSerializer(many=True)

    @atomic
    def create(self, validated_data: dict):
        ratings = validated_data.pop('ratings', [])
        review = models.Review.objects.create(**validated_data)
        for rating in ratings:
            models.Rating.objects.create(review=review, **rating)
        return review

    class Meta:
        model = models.Review
        fields = ['id', 'venue', 'venueName', 'body', 'ratings']


class UpdateReviewSerializer(ModelSerializer):
    ratings = ReviewRatingListSerializer(many=True)

    @atomic
    def update(self, instance: models.Review, validated_data: dict):
        ratings = validated_data.pop('ratings', [])
        for rating in ratings:
            value = rating.pop('value', 0)
            models.Rating.objects.update_or_create(
                defaults={'value': value}, review=instance, **rating)
        return super().update(instance, validated_data)

    class Meta:
        model = models.Review
        fields = ['id', 'body', 'ratings']


class ReviewListSerializer(ModelSerializer):
    venueName = CharField(source='venue.name', read_only=True)
    ratings = RatingListSerializer(many=True, read_only=True)

    class Meta:
        model = models.Review
        fields = ['id', 'venue', 'venueName', 'body', 'ratings']


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
