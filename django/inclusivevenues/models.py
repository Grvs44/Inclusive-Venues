from django.conf import settings
from django.core import validators
from django.db import models


class VenueCategory(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Venue categories"


class VenueSubcategory(models.Model):
    name = models.CharField(max_length=20)
    category = models.ForeignKey(VenueCategory, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Venue subcategories"


class Venue(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    added_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.TextField(null=True, blank=True)
    subcategory = models.ForeignKey(VenueSubcategory, on_delete=models.CASCADE)
    score = models.PositiveSmallIntegerField(null=True, blank=True)


class Review(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    body = models.TextField(null=True, blank=True)


class RatingCategory(models.Model):
    name = models.CharField(max_length=20)
    # TODO: add to ER diagram
    description = models.TextField()

    class Meta:
        verbose_name_plural = "Rating categories"


class Rating(models.Model):
    category = models.ForeignKey(RatingCategory, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    value = models.PositiveSmallIntegerField(validators=[
        validators.MinValueValidator(1),
        validators.MaxValueValidator(5),
    ])


class Image(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name='images')
    order = models.PositiveSmallIntegerField()
    alt = models.CharField(max_length=100)
    src = models.ImageField()
