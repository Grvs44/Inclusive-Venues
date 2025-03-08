'''Module containing TestCases for the inclusivevenues.views'''
# pylint:disable=no-member
from decimal import Decimal
from typing import Any

from inclusivevenues import models

from django.contrib.auth.models import User
from django.test import TestCase


def decimal_to_str(d: Any) -> str | Any:
    '''Convert d to a str if it is a Decimal'''
    if isinstance(d, Decimal):
        return str(d)
    return d


class VenueTestCase(TestCase):
    '''TestCase for inclusivevenues.views'''

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user('user', password='password')
        cls.venue_category = models.VenueCategory.objects.create(
            name='category1')
        cls.venue_subcategory = models.VenueSubcategory.objects.create(
            name='subcategory1', category=cls.venue_category)
        cls.venue = models.Venue.objects.create(
            name='venue', added_by=cls.user, subcategory=cls.venue_subcategory, longitude=50.937665, latitude=-1.395655)

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
        data = self.client.post('/api/venue', {
            'name': name, 'latitude': 50.934672,
            'longitude': -1.399775, 'subcategory': self.venue_subcategory.pk,
        }).json()

        venue: dict | None = models.Venue.objects.filter(
            name=name).values().first()
        if venue is None:
            self.fail('Venue was not created')

        # Convert fields from models.Venue object to same format as from API
        venue['score'] = decimal_to_str(venue.get('score'))
        venue['latitude'] = decimal_to_str(venue.get('latitude'))
        venue['longitude'] = decimal_to_str(venue.get('longitude'))
        venue.pop('added_by_id')
        venue['subcategory'] = venue.pop('subcategory_id', None)
        venue_map = venue['map']
        if venue_map:
            venue['map'] = 'http://testserver/media/' + venue_map
        else:
            venue['map'] = None
        venue['images'] = []

        self.assertDictEqual(data, venue)
        self.client.logout()

    def test_create_venue_empty(self):
        '''Test that an empty venue cannot be created'''
        self.assertTrue(self.client.login(
            username='user', password='password'))
        response = self.client.post('/api/venue', {})
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(response.json(), {
            'name': ['This field is required.'],
            'longitude': ['This field is required.'],
            'latitude': ['This field is required.'],
            'subcategory': ['This field is required.'],
        })
        self.client.logout()

    def test_create_venue_blank(self):
        '''Test that an empty venue cannot be created'''
        self.assertTrue(self.client.login(
            username='user', password='password'))
        response = self.client.post('/api/venue', {
            'name': '', 'latitude': '',
            'longitude': '', 'subcategory': '',
        })
        self.assertEqual(response.status_code, 400)
        self.assertDictEqual(response.json(), {
            'name': ['This field may not be blank.'],
            'longitude': ['A valid number is required.'],
            'latitude': ['A valid number is required.'],
            'subcategory': ['This field may not be null.'],
        })
        self.client.logout()

    def test_create_venue_anonymous(self):
        '''Test that a venue can't be created if the user isn't logged in'''
        self.client.logout()
        response = self.client.post('/api/venue', {
            'name': 'anonymous', 'latitude': 50.934672,
            'longitude': -1.399775, 'subcategory': self.venue_subcategory.pk,
        })
        self.assertEqual(response.status_code, 403)
        self.assertDictEqual(
            response.json(), {'detail': 'Authentication credentials were not provided.'})
