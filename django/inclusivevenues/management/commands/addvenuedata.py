'''Import sample data to the inclusivevenues app.
Run with `python manage.py addvenuedata FILE`
where FILE is a JSON file containing the venue data'''
# pylint:disable=no-member
import json
from random import Random

from inclusivevenues import models

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandParser
from django.db.transaction import atomic


def add_venue_data(import_data: list[dict]):
    user = User.objects.first()
    if user is None:
        user = User.objects.create_user('user1')

    categories: list[models.VenueCategory] = []
    subcategories: list[models.VenueSubcategory] = []
    venues: list[models.Venue] = []
    images: list[models.Image] = []
    for category_data in import_data:
        subcategories_data = category_data.pop('subcategories', [])
        category = models.VenueCategory(**category_data)
        categories.append(category)
        for subcategory_data in subcategories_data:
            venues_data = subcategory_data.pop('venues', [])
            name = subcategory_data['name']
            subcategory = models.VenueSubcategory(name=name, category=category)
            for venue_data in venues_data:
                images_data = venue_data.pop('images', [])
                venue = models.Venue(
                    added_by=user, subcategory=subcategory, **venue_data)
                venue.generate_map()
                venues.append(venue)
                for image_data in images_data:
                    images.append(models.Image(venue=venue, **image_data))
    models.VenueCategory.objects.bulk_create(categories)
    models.VenueSubcategory.objects.bulk_create(subcategories)
    models.Venue.objects.bulk_create(venues)
    models.Image.objects.bulk_create(images)
    return venues


def add_rating_categories():
    ratingcat1 = models.RatingCategory.objects.create(
        name='Trans-friendliness', description='How accepting/friendly staff and the environment are to trans people')
    ratingcat2 = models.RatingCategory.objects.create(
        name='Accessibility', description='How easy the venue is to access by wheelchair users')
    return [ratingcat1, ratingcat2]


def add_reviews(venues: list[models.Venue], rating_categories: list[models.RatingCategory]):
    usernames = ['Alex', 'Ben', 'Carly', 'Derek', 'Ed', 'Felicity']
    users: list[User] = []
    for username in usernames:
        user = User.objects.filter(username=username).first()
        if user is None:
            user = User.objects.create_user(username)
        users.append(user)
    reviews: list[models.Review] = []
    ratings: list[models.Rating] = []
    r = Random()
    for venue in venues:
        for user in users:
            review = models.Review(
                author=user, venue=venue, body=f'{user.username}\'s review for {venue.name}')
            reviews.append(review)
            for rating_cat in rating_categories:
                ratings.append(
                    models.Rating(review=review, category=rating_cat, value=r.randint(1, 5)))
    models.Review.objects.bulk_create(reviews)
    models.Rating.objects.bulk_create(ratings)

    for venue in venues:
        venue.update_score()


class Command(BaseCommand):
    help = __doc__  # type: ignore

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            'venue_file', help='Path to the JSON file containing the venues')
        parser.add_argument('--no-rating', action='store_true',
                            help='Don\'t add any rating categories (or reviews)')
        parser.add_argument('--no-review', action='store_true',
                            help='Don\'t add any reviews')

    @atomic
    def handle(self, *args, **options):
        with (open(options['venue_file'])) as file:
            venue_data = json.load(file)
        venues = add_venue_data(venue_data)
        if not options['no_rating']:
            categories = add_rating_categories()
            if not options['no_review']:
                add_reviews(venues, categories)
        self.stdout.write(self.style.SUCCESS('Imported data'))
