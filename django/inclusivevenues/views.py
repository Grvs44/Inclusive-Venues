'''
Views for the Inclusive Venues Django app
ViewSet documentation: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
'''
# pylint:disable=no-member
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.views import APIView, Response, status
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth import authenticate, login, logout
from django.db.utils import IntegrityError
from django.db.models import Avg

from . import models, permissions, serializers
from .filters import CategoryFilter, LocationFilter
from .pagination import Pagination


class ViewSet(ModelViewSet):
    pagination_class = Pagination


class ListViewSet(mixins.ListModelMixin, GenericViewSet):
    pass


class VenueCategoryViewSet(ListViewSet):
    queryset = models.VenueCategory.objects.all()
    serializer_class = serializers.VenueCategorySerializer


class VenueSubcategoryViewSet(mixins.RetrieveModelMixin, ListViewSet):
    queryset = models.VenueSubcategory.objects.all()
    serializer_class = serializers.VenueSubcategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']


class VenueViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.ListModelMixin, GenericViewSet):
    pagination_class = Pagination
    queryset = models.Venue.objects.all()
    permission_classes = [permissions.VenuePermission]
    filter_backends = [
        CategoryFilter, LocationFilter, OrderingFilter, SearchFilter
    ]
    ordering_fields = ['score']
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.VenueListSerializer
        return serializers.VenueSerializer

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)

    @action(methods=['GET'], detail=True, url_path='review')
    def get_review(self, request, pk):
        '''Get the current user's review for this Venue'''
        if request.user.is_anonymous:
            return Response(None, status.HTTP_401_UNAUTHORIZED)
        review = models.Review.objects.filter(
            venue_id=pk, author=request.user).first()
        if review is None:
            return Response(None, status.HTTP_204_NO_CONTENT)
        return Response(serializers.CreateReviewSerializer(review).data)

# Pagination adapted from ListModelMixin.list
# from https://github.com/encode/django-rest-framework/blob/master/rest_framework/mixins.py
    @action(methods=['GET'], detail=True, url_path='reviews')
    def list_reviews(self, request, pk):
        '''List the reviews of this venue'''
        queryset = models.Review.objects.filter(venue=pk)
        results = self.paginate_queryset(queryset)
        data = serializers.VenueReviewListSerializer(results, many=True).data
        return self.get_paginated_response(data)

    @action(methods=['GET'], detail=True, url_path='reviewavg')
    def get_rating_aggregation(self, request, pk):
        '''Get the average Rating values for each RatingCategory rated on this Venue'''
        results = models.Rating.objects.filter(review__venue=pk)\
            .values('category').annotate(value=Avg('value'))
        for item in results:
            item['value'] = round(item['value'], 1)
        return Response(results)


class ReviewViewSet(ViewSet):
    queryset = models.Review.objects
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['venue']
    permission_classes = [IsAuthenticated, permissions.ReviewPermission]

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ReviewListSerializer
        if self.action == 'create':
            return serializers.CreateReviewSerializer
        if self.action == 'update':
            return serializers.UpdateReviewSerializer
        return serializers.ReviewSerializer

    def get_queryset(self):
        return models.Review.objects.filter(author=self.request.user).all()

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
            self.queryset.get(
                pk=serializer.data.get('id')).venue.update_score()
        except IntegrityError as e:
            raise ValidationError(
                'You have already left a review for this venue') from e

    def perform_update(self, serializer):
        venue = self.get_object().venue
        super().perform_update(serializer)
        venue.update_score()

    def perform_destroy(self, instance):
        venue = self.get_object().venue
        super().perform_destroy(instance)
        venue.update_score()


class RatingCategoryViewSet(ListViewSet):
    queryset = models.RatingCategory.objects.all()
    serializer_class = serializers.RatingCategorySerializer
    permission_classes = [permissions.ReadOnly]


class RatingViewSet(ViewSet):
    queryset = models.Rating.objects
    serializer_class = serializers.RatingSerializer
    permission_classes = [IsAuthenticated, permissions.ReadOnly]

    def get_queryset(self):
        return models.Rating.objects.filter(review__author=self.request.user).all()


class ImageViewSet(ViewSet):
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer
    permission_classes = [permissions.ImagePermission]


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
