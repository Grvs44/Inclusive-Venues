from django.conf import settings
from django.core import validators
from django.db import models


class VenueCategory:
    name = models.CharField()


class VenueSubCategory:
    name = models.CharField()
    category = models.ForeignKey(VenueCategory, on_delete=models.CASCADE)


class Venue:
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    longitude = models.DecimalField()
    latitude = models.DecimalField()
    address = models.TextField(null=True, blank=True)
    subcategory = models.ForeignKey(VenueSubCategory, on_delete=models.CASCADE)


class Review:
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    body = models.TextField(null=True, blank=True)


class RatingCategory:
    name = models.CharField()
    # TODO: add to ER diagram
    description = models.TextField()


class Rating:
    category = models.ForeignKey(RatingCategory, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    value = models.PositiveSmallIntegerField(validators=[
        validators.MinValueValidator(1),
        validators.MaxValueValidator(5),
    ])
