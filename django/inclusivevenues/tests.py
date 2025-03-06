'''Module containing TestCases for the inclusivevenues Django app'''
# pylint:disable=no-member
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from django.test import TestCase, TransactionTestCase
from . import models


class ModelTestCase(TransactionTestCase):
    '''TransactionTestCase for inclusivevenues.models'''

    def setUp(self):
        category = models.VenueCategory.objects.create(name='category1')
        self.subcategory = models.VenueSubcategory.objects.create(
            name='subcategory1', category=category)
        self.rating_category = models.RatingCategory.objects.create(
            name='category1', description='rating category 1')

    def test_unique_constraints(self):
        '''Test the unique constraints prevent duplicate reviews and ratings from being created'''
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
        '''Test the Venue score is calculated correctly'''
        rating_category1 = models.RatingCategory.objects.create(
            name='venue_score1', description='rating category 1')
        rating_category2 = models.RatingCategory.objects.create(
            name='venue_score2', description='rating category 2')
        user1 = User.objects.create_user('venue_user1')
        user2 = User.objects.create_user('venue_user2')
        venue = models.Venue.objects.create(
            name='University', added_by=user1, longitude=50.937665, latitude=-1.395655, subcategory=self.subcategory)

        self.assertEqual(venue.score, None, 'Initial score')
        venue.update_score()
        venue.refresh_from_db()
        self.assertEqual(venue.score, None, 'Score with no reviews')

        review1 = models.Review.objects.create(author=user1, venue=venue)
        models.Rating.objects.create(
            review=review1, category=rating_category1, value=2)
        models.Rating.objects.create(
            review=review1, category=rating_category2, value=4)
        review2 = models.Review.objects.create(author=user2, venue=venue)
        models.Rating.objects.create(
            review=review2, category=rating_category1, value=5)
        models.Rating.objects.create(
            review=review2, category=rating_category2, value=3)

        venue.update_score()
        venue.refresh_from_db()
        self.assertEqual(venue.score, 3.5, 'Score with ratings')


class ViewTestCase(TestCase):
    '''TestCase for inclusivevenues.views'''
    def setUp(self):
        self.user = User.objects.create_user('user')
        venue_category = models.VenueCategory.objects.create(name='category1')
        venue_subcategory = models.VenueSubcategory.objects.create(
            name='subcategory1', category=venue_category)
        self.venue = models.Venue.objects.create(
            name='venue', added_by=self.user, subcategory=venue_subcategory, longitude=50.937665, latitude=-1.395655)

    def test_venue_detail(self):
        '''Test the Venue detail view contains the correct properties'''
        venue: dict = self.client.get(f'/api/venue/{self.venue.pk}').json()
        self.assertIsInstance(venue, dict)
        self.assertSetEqual(set(venue.keys()), {
            'id',
            'name',
            'description',
            'longitude',
            'latitude',
            'address',
            'subcategory',
            'score',
            'map',
            'images',
        })

    def test_venue_list(self):
        '''Test the Venue list view contains the correct properties'''
        data = self.client.get('/api/venue').json()
        self.assertIsInstance(data, dict)
        self.assertSetEqual(set(data.keys()), {
            'count', 'next', 'previous', 'results'
        })
        results = data['results']
        self.assertIsInstance(results, list)
        for item in results:
            self.assertIsInstance(item, dict)
            self.assertSetEqual(set(item.keys()), {
                'id',
                'name',
                'longitude',
                'latitude',
                'subcategory',
                'score',
            })

    def test_venue_list_with_location(self):
        '''Test the Venue list view contains the correct properties
        when the location is provided'''
        data = self.client.get(
            '/api/venue?location=50.934672,-1.399775').json()
        self.assertIsInstance(data, dict)
        self.assertSetEqual(set(data.keys()), {
            'count', 'next', 'previous', 'results'
        })
        results = data['results']
        self.assertIsInstance(results, list)
        for item in results:
            self.assertSetEqual(set(item.keys()), {
                'id',
                'name',
                'longitude',
                'latitude',
                'distance',
                'subcategory',
                'score',
            })
