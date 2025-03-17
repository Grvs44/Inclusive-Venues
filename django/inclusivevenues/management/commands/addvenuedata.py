'''Import sample data to the inclusivevenues app.
Run with `python manage.py addvenuedata FILE`
where FILE is a JSON file containing the venue data'''
# pylint:disable=no-member
import json
from random import randint

from inclusivevenues import models

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandParser
from django.db.transaction import atomic

USERNAMES = ['Alex', 'Ben', 'Carly', 'Derek', 'Ed', 'Felicity']


@atomic
def add_venue_data(import_data: list[dict]):
    user = User.objects.first()
    if user is None:
        user = User.objects.create_user('user1')

    venues: list[models.Venue] = []
    for category_data in import_data:
        subcategories_data = category_data.pop('subcategories', [])
        category = models.VenueCategory.objects.create(**category_data)
        for subcategory_data in subcategories_data:
            venues_data = subcategory_data.pop('venues', [])
            name = subcategory_data['name']
            subcategory = models.VenueSubcategory.objects.create(
                name=name, category=category)
            for venue_data in venues_data:
                images_data = venue_data.pop('images', [])
                venue = models.Venue(
                    added_by=user, subcategory=subcategory, **venue_data)
                venue.generate_map()
                if venue.map.name is None:
                    venue.save()
                venues.append(venue)
                for image_data in images_data:
                    models.Image.objects.create(venue=venue, **image_data)
    return venues


@atomic
def add_rating_categories(import_data: list[dict]):
    categories: list[models.RatingCategory] = []
    for category in import_data:
        categories.append(models.RatingCategory(**category))
    return models.RatingCategory.objects.bulk_create(categories)


def select_rating_categories(categories: list[models.RatingCategory]):
    if len(categories) <= 1:
        return categories
    selection: list[models.RatingCategory] = []
    start = randint(0, len(categories)-2)
    step = randint(start + 1, len(categories) - 1)
    for i in range(start, len(categories), step):
        selection.append(categories[i])
    return selection


@atomic
def add_reviews(venues: list[models.Venue], rating_categories: list[models.RatingCategory]):
    users: list[tuple[User, list[models.RatingCategory]]] = []
    for username in USERNAMES:
        user = User.objects.filter(username=username).first()
        if user is None:
            user = User.objects.create_user(username)
        users.append((user, select_rating_categories(rating_categories)))
    reviews: list[models.Review] = []
    ratings: list[models.Rating] = []
    for venue in venues:
        for user, rating_selection in users:
            review = models.Review(
                author=user, venue=venue, body=f'{user.username}\'s review for {venue.name}')
            reviews.append(review)
            for rating_cat in rating_selection:
                ratings.append(
                    models.Rating(review=review, category=rating_cat, value=randint(1, 5)))
    models.Review.objects.bulk_create(reviews)
    models.Rating.objects.bulk_create(ratings)

    for venue in venues:
        venue.update_score()


class Command(BaseCommand):
    help = __doc__  # type: ignore

    def add_arguments(self, parser: CommandParser):
        parser.add_argument(
            'venue_file', help='Path to the JSON file containing the venues')
        parser.add_argument(
            '-r', '--rating-file',
            help='''Path to the JSON file containing the rating categories.
            Omit to not import rating categories or generate reviews'''
        )
        parser.add_argument(
            '--no-review', action='store_true',
            help='Don\'t add any reviews'
        )

    def handle(self, *args, **options):
        with (open(options['venue_file'])) as file:
            venue_data = json.load(file)
        venues = add_venue_data(venue_data)
        self.stdout.write(self.style.SUCCESS('Imported venue data'))
        if options['rating_file']:
            with (open(options['rating_file'])) as file:
                rating_data = json.load(file)
            categories = add_rating_categories(rating_data)
            self.stdout.write(self.style.SUCCESS(
                'Imported rating category data'))
            if not options['no_review']:
                add_reviews(venues, categories)
                self.stdout.write(self.style.SUCCESS('Generated review data'))
