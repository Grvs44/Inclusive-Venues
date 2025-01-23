'''
Views for the Inclusive Venues Django app
ViewSet documentation: https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
'''
# pylint:disable=no-member
from rest_framework.views import APIView, Response, status
from rest_framework.viewsets import ModelViewSet

from django.contrib.auth import authenticate, login, logout

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
