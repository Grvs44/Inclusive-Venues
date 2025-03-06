'''Module containing TestCases for the inclusivevenues Django app'''
# pylint:disable=no-member
from decimal import Decimal
from typing import Any
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


def decimal_to_str(d: Any) -> str | Any:
    if isinstance(d, Decimal):
        return str(d)
    return d


class ViewTestCase(TestCase):
    '''TestCase for inclusivevenues.views'''

    def setUp(self):
        self.user = User.objects.create_user('user', password='password')
        self.venue_category = models.VenueCategory.objects.create(
            name='category1')
        self.venue_subcategory = models.VenueSubcategory.objects.create(
            name='subcategory1', category=self.venue_category)
        self.venue = models.Venue.objects.create(
            name='venue', added_by=self.user, subcategory=self.venue_subcategory, longitude=50.937665, latitude=-1.395655)

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

    def test_venue_list_with_invalid_location(self):
        '''Test that the correct error message is returned when
        invalid coordinates are provided'''
        data = self.client.get('/api/venue?location=here').json()
        self.assertListEqual(
            data, ['Invalid coordinates: must be of the form (latitude, longitude)'])

    def test_venue_list_with_invalid_latitude(self):
        '''Test that the correct error message is returned when
        a non-numeric latitude is given'''
        data = self.client.get('/api/venue?location=lat,-1.399776').json()
        self.assertListEqual(data, ['Latitude must be a number'])

    def test_venue_list_with_invalid_longitude(self):
        '''Test that the correct error message is returned when
        a non-numeric longitude is given'''
        data = self.client.get('/api/venue?location=50.934674,lon').json()
        self.assertListEqual(data, ['Longitude must be a number'])

    def test_create_venue(self):
        '''Test that a valid venue can be created'''
        self.assertTrue(self.client.login(
            username='user', password='password'))
        name = 'mynewvenue'
        data = self.client.post('/api/venue',  {
            'name': name, 'latitude': 50.934672,
            'longitude': -1.399775, 'subcategory': self.venue_subcategory.pk,
        }).json()

        venue: dict | None = models.Venue.objects.filter(
            name=name).values().first()
        if venue is None:
            self.fail('Venue was not created')

        venue['score'] = decimal_to_str(venue.get('score'))
        venue['latitude'] = decimal_to_str(venue.get('latitude'))
        venue['longitude'] = decimal_to_str(venue.get('longitude'))

        self.assertIsInstance(data.pop('map', None), str)
        venue.pop('map')
        self.assertDictEqual(data, venue)
        self.client.logout()
