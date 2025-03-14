'''Module for importing sample data
Run with `python manage.py addvenuedata FILE`
where FILE is a JSON file containing the venue data'''
# pylint:disable=no-member
import json

from inclusivevenues import models

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandParser
from django.db.transaction import atomic


def add_venue(venue, user: User):
    venue = models.Venue(added_by=user, **venue)
    venue.generate_map()
    venue.save()
    return venue


@atomic
def add_data(venue_data: list[dict], no_reviews: bool):
    user = User.objects.first()
    if user is None:
        user = User.objects.create_user('user1')
    food = models.VenueCategory.objects.create(name='Food')
    supermarkets = models.VenueSubcategory.objects.create(
        name='Supermarkets', category=food)
    restaurants = models.VenueSubcategory.objects.create(
        name='Restaurants', category=food)
    goingout = models.VenueCategory.objects.create(name='Going out')
    clubs = models.VenueSubcategory.objects.create(
        name='Night clubs', category=goingout)
    bars = models.VenueSubcategory.objects.create(
        name='Bars', category=goingout)

    venues = []
    for venue in venue_data:
        venues.append(add_venue(venue, user))
    ratingcat1 = models.RatingCategory.objects.create(
        name='Trans-friendliness', description='How accepting/friendly staff and the environment are to trans people')
    ratingcat2 = models.RatingCategory.objects.create(
        name='Accessibility', description='How easy the venue is to access by wheelchair users')
    if no_reviews:
        return
    # Create reviews here


class Command(BaseCommand):
    help = 'Import data to the inclusivevenues app'

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            'venue_file', help='Path to the JSON file containing the venues')
        parser.add_argument('--no-review', action='store_true',
                            help='Don\'t add any reviews')

    def handle(self, *args, **options):
        print(options)
        with (open(options['venue_file'])) as file:
            venue_data = json.load(file)
        add_data(venue_data, options['no-review'])
        self.stdout.write(self.style.SUCCESS('Imported data'))
