# pylint:disable=no-member
from decimal import Decimal
from django.conf import settings
from django.core import validators
from django.db import models
from django.db.models.constraints import UniqueConstraint

from .maps import get_map_image_url


class VenueCategory(models.Model):
    name = models.CharField(max_length=32)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = 'Venue categories'


class VenueSubcategory(models.Model):
    name = models.CharField(max_length=32)
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
    score = models.DecimalField(null=True, blank=True, max_digits=2, decimal_places=1, validators=[
        validators.MinValueValidator(Decimal(1)),
        validators.MaxValueValidator(Decimal(5)),
    ])
    map = models.ImageField(null=True, blank=True)

    def __str__(self):
        return str(self.name)

    def generate_map(self):
        url = get_map_image_url(self.latitude, self.longitude)
        if url is not None:
            self.map = url
            super().save()

    def calculate_score(self):
        self.score = self.review_set.aggregate(  # type: ignore
            models.Avg('ratings__value')
        )['ratings__value__avg']

    def update_score(self):
        self.calculate_score()
        self.save()


class Review(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    body = models.TextField(null=True, blank=True)
    date = models.DateField(auto_now=True, verbose_name='Last modified')

    def __str__(self):
        return f'{self.venue.name} by {self.author.username}'

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['author', 'venue'],
                name='unique_venue_author',
                violation_error_message='You may only leave one review per venue'
            )
        ]


class RatingCategory(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = 'Rating categories'


class Rating(models.Model):
    category = models.ForeignKey(
        RatingCategory, on_delete=models.CASCADE, related_name='ratings')
    review = models.ForeignKey(
        Review, on_delete=models.CASCADE, related_name='ratings')
    value = models.PositiveSmallIntegerField(validators=[
        validators.MinValueValidator(1),
        validators.MaxValueValidator(5),
    ])

    def __str__(self):
        return f'Rating ({self.id})'  # type: ignore

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=['category', 'review'],
                name='unique_category_review',
                violation_error_message='You may only rate each category once per review'
            )
        ]


class Image(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name='images')
    order = models.PositiveSmallIntegerField()
    alt = models.CharField(max_length=100)
    src = models.ImageField()

    def __str__(self):
        return f'{self.venue.name}: {self.order}'
