'''
Routing for Inclusive Venues Django app
Router documentation: https://www.django-rest-framework.org/api-guide/routers/
'''
from rest_framework.routers import DefaultRouter

from django.urls import include, path

from . import views

router = DefaultRouter(trailing_slash=False)
router.register(r'venuecat', views.VenueCategoryViewSet)
router.register(r'venuesub', views.VenueSubcategoryViewSet)
router.register(r'venue', views.VenueViewSet)
router.register(r'review', views.ReviewViewSet)
router.register(r'ratingcat', views.RatingCategoryViewSet)
router.register(r'rating', views.RatingViewSet)
router.register(r'image', views.ImageViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/user', views.UserView.as_view()),
    path('api/login', views.LoginView.as_view()),
    path('api/logout', views.LogoutView.as_view()),
    path('', views.index_view),
]
