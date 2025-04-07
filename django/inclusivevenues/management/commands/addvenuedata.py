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
def add_venue_data(import_data: list[dict], maps_exist: bool):
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
                if maps_exist:
                    venue.map.name = f"{venue_data['latitude']}{venue_data['longitude']}.png"
                    venue.save()
                else:
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
        categories.append(models.RatingCategory.objects.create(**category))
    return categories


def select_rating_categories(categories: list[models.RatingCategory]):
    if len(categories) <= 1:
        return [category.pk for category in categories]
    selection: list[int] = []
    start = randint(0, len(categories)-2)
    step = randint(start + 1, len(categories) - 1)
    for i in range(start, len(categories), step):
        selection.append(i)
    return selection


@atomic
def add_reviews(venues: list[models.Venue], rating_categories: list[models.RatingCategory]):
    users: list[tuple[User, list[int]]] = []
    for username in USERNAMES:
        user = User.objects.filter(username=username).first()
        if user is None:
            user = User.objects.create_user(username)
        users.append((user, select_rating_categories(rating_categories)))
    reviews: list[models.Review] = []
    ratings: list[models.Rating] = []
    for venue in venues:
        for user, rating_selection in users:
            review = models.Review.objects.create(
                author=user, venue=venue, body=f'{user.username}\'s review for {venue.name}')
            reviews.append(review)
            for cat_index in rating_selection:
                ratings.append(models.Rating.objects.create(
                    review=review,
                    category=rating_categories[cat_index],
                    value=randint(1, 5)
                ))

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
        parser.add_argument(
            '--maps-exist', action='store_true',
            help='Instead of generating new map previews, link to existing images'
        )

    def handle(self, *args, **options):
        with (open(options['venue_file'])) as file:
            venue_data = json.load(file)
        venues = add_venue_data(venue_data, options['maps_exist'])
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
