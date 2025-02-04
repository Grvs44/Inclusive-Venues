# pylint:disable=no-member
from django.conf import settings
from django.core import validators
from django.db import models

from .maps import get_image_url


class VenueCategory(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = 'Venue categories'


class VenueSubcategory(models.Model):
    name = models.CharField(max_length=20)
    category = models.ForeignKey(VenueCategory, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.category.name} > {self.name}'

    class Meta:
        verbose_name_plural = 'Venue subcategories'


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
    map = models.ImageField(null=True, blank=True)

    def __str__(self):
        return str(self.name)

    def generate_map(self):
        self.map = get_image_url(self.latitude, self.longitude)

    def clean(self):
        super().clean()
        if self.map.name is None:
            self.generate_map()


class Review(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    body = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.venue.name} by {self.author.username}'


class RatingCategory(models.Model):
    name = models.CharField(max_length=20)
    # TODO: add to ER diagram
    description = models.TextField()

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = 'Rating categories'


class Rating(models.Model):
    category = models.ForeignKey(RatingCategory, on_delete=models.CASCADE)
    review = models.ForeignKey(Review, on_delete=models.CASCADE)
    value = models.PositiveSmallIntegerField(validators=[
        validators.MinValueValidator(1),
        validators.MaxValueValidator(5),
    ])

    def __str__(self):
        return f'Rating ({self.id})'  # type: ignore


class Image(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name='images')
    order = models.PositiveSmallIntegerField()
    alt = models.CharField(max_length=100)
    src = models.ImageField()

    def __str__(self):
        return f'{self.venue.name}: {self.order}'
