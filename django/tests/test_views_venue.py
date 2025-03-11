'''Module containing TestCases for inclusivevenues.views.VenueViewSet'''
# pylint:disable=no-member
from inclusivevenues import models

from django.contrib.auth.models import User
from django.test import TestCase, tag


class VenueTestCase(TestCase):
    '''TestCase for inclusivevenues.views.VenueViewSet'''
    credentials = {'username': 'venue_user', 'password': 'password'}
    credentials2 = {'username': 'venue_user2', 'password': 'password2'}

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(**cls.credentials)
        cls.user2 = User.objects.create_user(**cls.credentials2)
        cls.venue_category = models.VenueCategory.objects.create(
            name='category1')
        cls.venue_subcategory = models.VenueSubcategory.objects.create(
            name='subcategory1', category=cls.venue_category)
        cls.venue = models.Venue.objects.create(
            name='venue', added_by=cls.user, subcategory=cls.venue_subcategory,
            longitude=50.937665, latitude=-1.395655)
        cls.venue2 = models.Venue.objects.create(
            name='venue2', added_by=cls.user, subcategory=cls.venue_subcategory,
            longitude=50.937664, latitude=-1.395654)
        cls.ratingcat1 = models.RatingCategory.objects.create(
            name='venue_ratingcat1', description='d1')
        cls.ratingcat2 = models.RatingCategory.objects.create(
            name='venue_ratingcat2', description='d2')
        cls.review = models.Review.objects.create(
            author=cls.user, venue=cls.venue, body='review body')
        cls.rating1 = models.Rating.objects.create(
            category=cls.ratingcat1, review=cls.review, value=4)
        cls.rating2 = models.Rating.objects.create(
            category=cls.ratingcat2, review=cls.review, value=5)

    def test_venue_detail(self):
        '''Test the Venue detail view contains the correct properties'''
        result: dict = self.client.get(f'/api/venue/{self.venue.pk}').json()
        self.assertIsInstance(result, dict)

        venue: dict | None = models.Venue.objects.filter(
            pk=self.venue.pk).values().first()
        if venue is None:
            self.fail('Venue does not exist in database')
        venue.pop('added_by_id')
        venue['subcategory'] = venue.pop('subcategory_id')
        score = venue['score']
        if score is not None:
            venue['score'] = str(score)
        venue['latitude'] = str(venue['latitude'])
        venue['longitude'] = str(venue['longitude'])
        venue_map = venue['map']
        if venue_map:
            venue['map'] = 'http://testserver/media/' + venue_map
        else:
            venue['map'] = None
        venue['images'] = list(models.Image.objects.filter(
            venue_id=self.venue.pk).values())

        self.assertDictEqual(result, venue)

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
        self.assertTrue(self.client.login(**self.credentials))
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
        score = venue['score']
        if score is not None:
            venue['score'] = str(venue['score'])
        venue['latitude'] = str(venue['latitude'])
        venue['longitude'] = str(venue['longitude'])
        venue.pop('added_by_id')
        venue['subcategory'] = venue.pop('subcategory_id', None)
        venue_map = venue['map']
        if venue_map:
            venue['map'] = 'http://testserver/media/' + venue_map
        else:
            venue['map'] = None
        venue['images'] = list(
            models.Image.objects.filter(venue__name=name).values())

        self.assertDictEqual(data, venue)
        self.client.logout()

    def test_create_venue_empty(self):
        '''Test that an empty venue cannot be created'''
        self.assertTrue(self.client.login(**self.credentials))
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
        self.assertTrue(self.client.login(**self.credentials))
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

    def test_update_venue_valid(self):
        '''Test that a user can update a venue they added'''
        self.assertTrue(self.client.login(**self.credentials))
        response = self.client.put(f'/api/venue/{self.venue.pk}', {
            'name': 'updated venue', 'latitude': 50.934673,
            'longitude': -1.399776, 'subcategory': self.venue_subcategory.pk,
        }, content_type='application/json')

        venue = models.Venue.objects.filter(pk=self.venue.pk).values().first()
        if venue is None:
            self.fail('Venue to update not found in database')
        # Convert fields from models.Venue object to same format as from API
        score = venue['score']
        if score is not None:
            venue['score'] = str(score)
        venue['latitude'] = str(venue.get('latitude'))
        venue['longitude'] = str(venue.get('longitude'))
        venue.pop('added_by_id')
        venue['subcategory'] = venue.pop('subcategory_id', None)
        venue_map = venue['map']
        if venue_map:
            venue['map'] = 'http://testserver/media/' + venue_map
        else:
            venue['map'] = None
        venue['images'] = list(models.Image.objects.filter(
            venue__name='updated venue').values())

        self.assertDictEqual(response.json(), venue)
        self.client.logout()

    def test_update_other_venue(self):
        '''Test a user can't update a venue added by someone else'''
        self.assertTrue(self.client.login(**self.credentials2))
        response = self.client.put(
            f'/api/venue/{self.venue.pk}', {'name': 'updated venue?'})
        self.assertEqual(response.status_code, 403)
        self.assertDictEqual(response.json(), {
            'detail': 'You do not have permission to perform this action.'
        })
        self.client.logout()

    def test_update_venue_anonymous(self):
        '''Test a logged-out user can't update a venue'''
        self.client.logout()
        response = self.client.put(
            f'/api/venue/{self.venue.pk}', {'name': 'updated anonymous venue?'})
        self.assertEqual(response.status_code, 403)
        self.assertDictEqual(response.json(), {
            'detail': 'Authentication credentials were not provided.'
        })

    def test_delete_venue_creator(self):
        '''Test that the user who added a venue can't delete it'''
        self.assertTrue(self.client.login(**self.credentials))
        response = self.client.delete(f'/api/venue/{self.venue.pk}')
        self.assertEqual(response.status_code, 405)
        self.assertDictEqual(
            response.json(), {'detail': 'Method "DELETE" not allowed.'})
        self.client.logout()

    def test_delete_venue_other(self):
        '''Test that a user can't delete a venue added by someone else'''
        self.assertTrue(self.client.login(**self.credentials2))
        response = self.client.delete(f'/api/venue/{self.venue.pk}')
        self.assertEqual(response.status_code, 405)
        self.assertDictEqual(
            response.json(), {'detail': 'Method "DELETE" not allowed.'})
        self.client.logout()

    def test_delete_venue_anonymous(self):
        '''Test that a logged-out user can't delete a venue'''
        self.client.logout()
        response = self.client.delete(f'/api/venue/{self.venue.pk}')
        self.assertEqual(response.status_code, 403)
        self.assertDictEqual(response.json(), {
            'detail': 'Authentication credentials were not provided.'
        })

    @tag('get_review')
    def test_venue_get_review_valid(self):
        '''Test that the user's review is returned for the venue'''
        self.assertTrue(self.client.login(**self.credentials))
        data = self.client.get(f'/api/venue/{self.venue.pk}/review').json()
        self.assertIsInstance(data, dict)

        self.assertIn('ratings', data)
        data_ratings = data.pop('ratings')

        review = {'id': self.review.pk, 'venue': self.venue.pk,
                  'venueName': self.venue.name, 'body': self.review.body}
        self.assertDictEqual(data, review)

        ratings = [
            {'category': self.ratingcat1.pk, 'value': self.rating1.value},
            {'category': self.ratingcat2.pk, 'value': self.rating2.value},
        ]
        self.assertListEqual(data_ratings, ratings)
        self.client.logout()

    @tag('get_review')
    def test_venue_get_review_empty(self):
        '''Test that no content is returned if the user hasn't left a review for this venue'''
        self.assertTrue(self.client.login(**self.credentials))
        response = self.client.get(f'/api/venue/{self.venue2.pk}/review')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(response.content), 0)
        self.client.logout()

    @tag('get_review')
    def test_venue_get_review_anonymous(self):
        '''Test that an error is returned if the user is logged-out and tries to fetch their review for a venue'''
        self.client.logout()
        response = self.client.get(f'/api/venue/{self.venue.pk}/review')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(len(response.content), 0)
