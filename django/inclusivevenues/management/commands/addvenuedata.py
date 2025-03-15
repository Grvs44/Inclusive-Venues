'''Import sample data to the inclusivevenues app.
Run with `python manage.py addvenuedata FILE`
where FILE is a JSON file containing the venue data'''
# pylint:disable=no-member
import json

from inclusivevenues import models

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandParser
from django.db.transaction import atomic


@atomic
def add_data(import_data: list[dict], no_reviews: bool):
    user = User.objects.first()
    if user is None:
        user = User.objects.create_user('user1')
    
    venues:list[models.Venue] = []
    for category_data in import_data:
        subcategories = category_data.pop('subcategories', [])
        category = models.VenueCategory.objects.create(**category_data)
        for subcategory_data in subcategories:
            venues_data = subcategory_data.pop('venues', [])
            name = subcategory_data['name']
            subcategory = models.VenueSubcategory.objects.create(
                name=name, category=category)
            for venue_data in venues_data:
                venue = models.Venue(
                    added_by=user, subcategory=subcategory, **venue_data)
                venue.generate_map()
                venue.save()
                venues.append(venue)

    ratingcat1 = models.RatingCategory.objects.create(
        name='Trans-friendliness', description='How accepting/friendly staff and the environment are to trans people')
    ratingcat2 = models.RatingCategory.objects.create(
        name='Accessibility', description='How easy the venue is to access by wheelchair users')
    if no_reviews:
        return
    # Create reviews here


class Command(BaseCommand):
    help = __doc__ # type: ignore

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            'venue_file', help='Path to the JSON file containing the venues')
        parser.add_argument('--no-review', action='store_true',
                            help='Don\'t add any reviews')

    def handle(self, *args, **options):
        with (open(options['venue_file'])) as file:
            venue_data = json.load(file)
        add_data(venue_data, options['no_review'])
        self.stdout.write(self.style.SUCCESS('Imported data'))
