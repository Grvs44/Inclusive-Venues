# Adapted from https://docs.djangoproject.com/en/5.1/ref/contrib/admin/
from django.contrib import admin
from . import models


class ModelAdmin(admin.ModelAdmin):
    list_per_page = 10


@admin.register(models.VenueCategory)
class VenueCategoryAdmin(ModelAdmin):
    list_display = ['name']


@admin.register(models.VenueSubCategory)
class VenueSubCategoryAdmin(ModelAdmin):
    list_display = ['category__name', 'name']


@admin.register(models.Venue)
class VenueAdmin(ModelAdmin):
    list_display = ['name']


@admin.register(models.Review)
class ReviewAdmin(ModelAdmin):
    list_display = ['author__username', 'venue__name']


@admin.register(models.RatingCategory)
class RatingCategoryAdmin(ModelAdmin):
    list_display = ['name']


@admin.register(models.Rating)
class RatingAdmin(ModelAdmin):
    list_display = ['review__venue__name', 'category__name', 'value']
