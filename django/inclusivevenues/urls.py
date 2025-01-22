'''
Routing for Inclusive Venues Django app
Router documentation: https://www.django-rest-framework.org/api-guide/routers/
'''
from rest_framework.routers import DefaultRouter

from django.urls import include, path

from . import views

router = DefaultRouter()
router.register(r'venuecat', views.VenueCategoryViewSet)
router.register(r'venuesub', views.VenueSubcategoryViewSet)
router.register(r'venue', views.VenueViewSet)
router.register(r'review', views.ReviewViewSet)
router.register(r'ratingcat', views.RatingCategoryViewSet)
router.register(r'rating', views.RatingViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
