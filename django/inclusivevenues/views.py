'''
Views for the Inclusive Venues Django app
ViewSet documentation: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
'''
# pylint:disable=no-member
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.views import APIView, Response, status
from rest_framework.viewsets import ModelViewSet

from django.contrib.auth import authenticate, login, logout

from . import models, serializers
from .pagination import Pagination


class ViewSet(ModelViewSet):
    pagination_class = Pagination


class VenueCategoryViewSet(ViewSet):
    queryset = models.VenueCategory.objects.all()
    serializer_class = serializers.VenueCategorySerializer


class VenueSubcategoryViewSet(ViewSet):
    queryset = models.VenueSubcategory.objects.all()
    serializer_class = serializers.VenueSubcategorySerializer


class VenueViewSet(ViewSet):
    queryset = models.Venue.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.VenueListSerializer
        return serializers.VenueSerializer

    @action(methods=['GET'], detail=True, url_path='review')
    def get_review(self, request, pk):
        '''Get the current user's review for this Venue'''
        if request.user.is_anonymous:
            return Response(None, status.HTTP_401_UNAUTHORIZED)
        review = models.Review.objects.filter(
            venue_id=pk, author=request.user).first()
        return Response(None if review is None else serializers.CreateReviewSerializer(review).data)

# Pagination adapted from ListModelMixin.list
# from https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py
    @action(methods=['GET'], detail=True, url_path='reviews')
    def list_reviews(self, request, pk):
        '''List the reviews of this venue'''
        queryset = models.Review.objects.filter(venue=pk)
        results = self.paginate_queryset(queryset)
        data = serializers.ReviewListSerializer(results, many=True).data
        return self.get_paginated_response(data)


class ReviewViewSet(ViewSet):
    queryset = models.Review.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['venue']

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ReviewListSerializer
        if self.action == 'create':
            return serializers.CreateReviewSerializer
        if self.action == 'update':
            return serializers.UpdateReviewSerializer
        return serializers.ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        self.get_object().venue.update_score()

    def perform_update(self, serializer):
        super().perform_update(serializer)
        self.get_object().venue.update_score()

    def perform_destroy(self, instance):
        super().perform_destroy(instance)
        self.get_object().venue.update_score()


class RatingCategoryViewSet(ViewSet):
    queryset = models.RatingCategory.objects.all()
    serializer_class = serializers.RatingCategorySerializer


class RatingViewSet(ViewSet):
    queryset = models.Rating.objects.all()
    serializer_class = serializers.RatingSerializer


class ImageViewSet(ViewSet):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer


class UserView(APIView):
    '''API endpoint for viewing current user details'''

    def get(self, request):
        '''Handle GET request'''
        return Response({
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'username': request.user.username
        } if request.user.is_authenticated else None)


# LoginView and LogoutView adapted from
# https://github.com/Grvs44/Grvs-Account/blob/main/grvsaccount/views.py
class LoginView(APIView):
    '''API endpoint for logging in with username and password'''

    def post(self, request):
        '''Handle POST request'''
        user = authenticate(
            request,
            username=request.data.get('username'),
            password=request.data.get('password')
        )
        if user is None:
            return Response({'detail': 'Incorrect username or password'}, status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response({
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'username': request.user.username
        })


class LogoutView(APIView):
    '''API endpoint for logging out'''

    def post(self, request):
        '''Handle POST request'''
        if request.user.is_authenticated:
            logout(request)
            return Response(None, status.HTTP_204_NO_CONTENT)
        return Response({'detail': 'Not logged in'}, status.HTTP_401_UNAUTHORIZED)
