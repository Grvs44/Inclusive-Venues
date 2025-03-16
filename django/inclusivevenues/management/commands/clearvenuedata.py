'''Clear the database for the inclusivevenues app.
Run with `python manage.py clearvenuedata`'''
# pylint:disable=no-member
from inclusivevenues import models

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandParser
from django.db.transaction import atomic

from .addvenuedata import USERNAMES


class Command(BaseCommand):
    help = __doc__  # type: ignore

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            '--users', action='store_true',
            help='Also delete users added when the data was imported')

    @atomic
    def handle(self, *args, **options):
        if options['users']:
            User.objects.filter(username__in=USERNAMES).delete()
        # Also deletes VenueSubcategory, Venue, Review, Rating, Image through foreign keys:
        models.VenueCategory.objects.all().delete()
        models.RatingCategory.objects.all().delete()
