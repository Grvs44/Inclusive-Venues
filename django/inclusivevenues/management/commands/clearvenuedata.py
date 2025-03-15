'''Clear the database for the inclusivevenues app.
Run with `python manage.py clearvenuedata`'''
# pylint:disable=no-member
from inclusivevenues import models

from django.core.management.base import BaseCommand
from django.db.transaction import atomic


class Command(BaseCommand):
    help = __doc__  # type: ignore

    @atomic
    def handle(self, *args, **options):
        # Also deletes VenueSubcategory, Venue, Review, Rating, Image through foreign keys:
        models.VenueCategory.objects.all().delete()
        models.RatingCategory.objects.all().delete()
