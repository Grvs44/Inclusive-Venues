'''Module containing TestCases for inclusivevenues.views.ReviewViewSet'''
# pylint:disable=no-member
from inclusivevenues import models

from django.contrib.auth.models import User
from django.test import TestCase, tag


class ReviewTestCase(TestCase):
    '''TestCase for inclusivevenues.views.ReviewTestCase'''
    credentials = {'username': 'review-user', 'password': 'password'}
    credentials2 = {'username': 'review-user2', 'password': 'password2'}

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(**cls.credentials)
        cls.user2 = User.objects.create_user(**cls.credentials2)
        venue_cat = models.VenueCategory.objects.create(
            name='review_venuecat1')
        venue_sub = models.VenueSubcategory.objects.create(
            name='review_venuesub1', category=venue_cat)
        cls.venue1 = models.Venue.objects.create(
            name='review_venue1', added_by=cls.user, subcategory=venue_sub,
            longitude=50.937665, latitude=-1.395655)
        cls.venue2 = models.Venue.objects.create(
            name='review_venue2', added_by=cls.user, subcategory=venue_sub,
            longitude=50.937662, latitude=-1.395652)
        cls.ratingcat1 = models.RatingCategory.objects.create(
            name='review_ratingcat1', description='d1')
        cls.ratingcat2 = models.RatingCategory.objects.create(
            name='review_ratingcat2', description='d2')
        cls.review1 = models.Review.objects.create(
            author=cls.user, venue=cls.venue1, body='review1 body')
        models.Rating.objects.create(
            review=cls.review1, category=cls.ratingcat1, value=4)

    def tearDown(self):
        # Log out after each test
        self.client.logout()

    @tag('review_detail')
    def test_review_detail_valid(self):
        '''Test a user can view one of their reviews'''
        self.assertTrue(self.client.login(**self.credentials))
        response = self.client.get(f'/api/review/{self.review1.pk}')
        review = {'id': self.review1.pk, 'author': self.review1.author.pk,
                  'venue': self.review1.venue.pk, 'body': self.review1.body}
        self.assertDictEqual(response.json(), review)

    @tag('review_detail')
    def test_review_detail_other(self):
        '''Test a user cannot view another user's review'''
        self.assertTrue(self.client.login(**self.credentials2))
        response = self.client.get(f'/api/review/{self.review1.pk}')
        self.assertEqual(response.status_code, 404)
        self.assertDictEqual(
            response.json(), {'detail': 'No Review matches the given query.'})

    @tag('review_detail')
    def test_review_detail_anonymous(self):
        '''Test a logged-out user cannot view a user's review'''
        response = self.client.get(f'/api/review/{self.review1.pk}')
        self.assertEqual(response.status_code, 403)
        self.assertDictEqual(
            response.json(), {'detail': 'Authentication credentials were not provided.'})

    @tag('review_create')
    def test_review_create_valid(self):
        '''Test a user can leave a review'''
        self.assertTrue(self.client.login(**self.credentials2))
        response = self.client.post('/api/review', {'venue': self.venue1.pk, 'body': 'my review!', 'ratings': [
            {'category': self.ratingcat1.pk, 'value': 2},
            {'category': self.ratingcat2.pk, 'value': 4},
        ]}, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIsInstance(data, dict)
        review = models.Review.objects.filter(
            venue=self.venue1, author=self.user2).first()
        if review is None:
            self.fail('Review was not created')
        self.assertDictEqual(data, {
            'id': review.pk, 'venue': self.venue1.pk,
            'venueName': self.venue1.name, 'body': review.body,
            'ratings': list(models.Rating.objects.filter(review=review).values('category', 'value'))
        })

    @tag('review_create')
    def test_review_create_no_ratings(self):
        '''Test a user can't leave a review with no ratings (via API)'''
        self.assertTrue(self.client.login(**self.credentials2))
        response = self.client.post(
            '/api/review', {'venue': self.venue2.pk, 'body': 'my review?', 'ratings': []}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertListEqual(
            response.json(), ['You must rate at least one category to leave a review'])

    @tag('review_create')
    def test_review_create_existing(self):
        '''Test a user can't create a new review for a venue they have already reviewed'''
        self.assertTrue(self.client.login(**self.credentials))
        response = self.client.post('/api/review', {'venue': self.venue1.pk, 'body': 'my review?', 'ratings': [
            {'category': self.ratingcat1.pk, 'value': 2},
            {'category': self.ratingcat2.pk, 'value': 4},
        ]}, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertListEqual(
            response.json(), ['You have already left a review for this venue'])

    @tag('review_create')
    def test_review_create_anonymous(self):
        '''Test a logged-out user can't create a review'''
        response = self.client.post('/api/review', {'venue': self.venue1.pk, 'body': 'my review?', 'ratings': [
            {'category': self.ratingcat1.pk, 'value': 2},
            {'category': self.ratingcat2.pk, 'value': 4},
        ]}, content_type='application/json')
        self.assertEqual(response.status_code, 403)
        self.assertDictEqual(
            response.json(), {'detail': 'Authentication credentials were not provided.'})
