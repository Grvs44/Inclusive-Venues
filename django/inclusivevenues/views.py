# Adapted from https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
from rest_framework.viewsets import ModelViewSet
from . import models, serializers


class VenueCategoryViewSet(ModelViewSet):
    queryset = models.VenueCategory.objects
    serializer_class = serializers.VenueCategorySerializer


class VenueSubcategoryViewSet(ModelViewSet):
    queryset = models.VenueSubcategory.objects
    serializer_class = serializers.VenueSubcategorySerializer


class VenueViewSet(ModelViewSet):
    queryset = models.Venue.objects
    serializer_class = serializers.VenueSerializer


class ReviewViewSet(ModelViewSet):
    queryset = models.Review.objects
    serializer_class = serializers.ReviewSerializer


class RatingCategoryViewSet(ModelViewSet):
    queryset = models.RatingCategory.objects
    serializer_class = serializers.RatingCategorySerializer


class RatingViewSet(ModelViewSet):
    queryset = models.Rating.objects
    serializer_class = serializers.RatingSerializer
