'''Module containing TestCases for the inclusivevenues Django app'''
# pylint:disable=no-member,missing-function-docstring
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.test import TransactionTestCase
from . import models


class ModelTestCase(TransactionTestCase):
    '''TestCase for inclusivevenues.models'''

    def setUp(self):
        category = models.VenueCategory.objects.create(name='category1')
        self.subcategory = models.VenueSubcategory.objects.create(
            name='subcategory1', category=category)
        self.rating_category = models.RatingCategory.objects.create(
            name='category1', description='rating category 1')

    def test_unique_constraints(self):
        user = User.objects.create_user('constraint_user')
        venue = models.Venue.objects.create(
            name='venue1', added_by=user, longitude=0, latitude=0, subcategory=self.subcategory)
        review = models.Review.objects.create(
            author=user, venue=venue)
        models.Rating.objects.create(
            review=review, category=self.rating_category, value=3)
        self.assertRaises(
            IntegrityError,
            models.Rating.objects.create,
            review=review, category=self.rating_category, value=4
        )
        self.assertRaises(
            IntegrityError,
            models.Review.objects.create,
            author=user, venue=venue
        )

    def test_venue_calculate_score(self):
        rating_category1 = models.RatingCategory.objects.create(
            name='venue_score1', description='rating category 1')
        rating_category2 = models.RatingCategory.objects.create(
            name='venue_score2', description='rating category 2')
        user1 = User.objects.create_user('venue_user1')
        user2 = User.objects.create_user('venue_user2')
        venue = models.Venue.objects.create(
            name='University', added_by=user1, longitude=50.937665, latitude=-1.395655, subcategory=self.subcategory)

        venue.update_score()
        venue.refresh_from_db()
        self.assertEqual(venue.score, 0)

        review1 = models.Venue.objects.create(author=user1, venue=venue)
        models.Rating.objects.create(
            review=review1, category=rating_category1, value=2)
        models.Rating.objects.create(
            review=review1, category=rating_category2, value=4)
        review2 = models.Venue.objects.create(author=user2, venue=venue)
        models.Rating.objects.create(
            review=review2, category=rating_category1, value=5)
        models.Rating.objects.create(
            review=review2, category=rating_category2, value=3)

        venue.update_score()
        venue.refresh_from_db()
        self.assertEqual(venue.score, 3.5)
