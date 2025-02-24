from rest_framework.permissions import BasePermission, SAFE_METHODS
from . import models


# Adapted from IsOwnerOrReadOnly
# from https://www.django-rest-framework.org/api-guide/permissions/
class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        return request.method in SAFE_METHODS


class VenuePermission(BasePermission):
    def has_object_permission(self, request, view, obj: models.Venue):
        return request.method in SAFE_METHODS or request.user == obj.added_by


class ReviewPermission(ReadOnly):
    def has_object_permission(self, request, view, obj: models.Review):
        return request.method in SAFE_METHODS or request.user == obj.author
