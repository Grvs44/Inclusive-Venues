'''Module containing TestCases for inclusivevenues.views.ReviewViewSet'''
# pylint:disable=no-member
from inclusivevenues import models

from django.contrib.auth.models import User
from django.test import TestCase


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
        cls.venue1 = models.Venue.objects.create(
            name='review_venue2', added_by=cls.user, subcategory=venue_sub,
            longitude=50.937662, latitude=-1.395652)
        cls.review1 = models.Review.objects.create(
            author=cls.user, venue=cls.venue1, body='review1 body')

    def test_review_detail_valid(self):
        '''Test a user can view one of their reviews'''
        self.assertTrue(self.client.login(**self.credentials))
        response = self.client.get(f'/api/review/{self.review1.pk}')
        review = {'id': self.review1.pk, 'author': self.review1.author.pk,
                  'venue': self.review1.venue.pk, 'body': self.review1.body}
        self.assertDictEqual(response.json(), review)
        self.client.logout()
