'''Module to test UserView, LoginView, and LogoutView from inclusivevenues.views'''
from django.contrib.auth.models import User
from django.test import TestCase


class UserViewTestCase(TestCase):
    '''TestCase for inclusivevenues.views.UserView'''
    @classmethod
    def setUpTestData(cls) -> None:
        User.objects.create_user(
            'userview', password='user-password', first_name='user', last_name='view')

    def test_user_anonymous(self):
        '''Test view when not logged in'''
        self.client.logout()
        response = self.client.get('/api/user')
        self.assertEqual(len(response.content), 0)

    def test_user_valid(self):
        '''Test view when logged in'''
        self.assertTrue(self.client.login(
            username='userview', password='user-password'))
        data = self.client.get('/api/user').json()
        self.assertDictEqual(
            data, {'firstName': 'user', 'lastName': 'view', 'username': 'userview'})
        self.client.logout()


class LoginViewTestCase(TestCase):
    '''TestCase for inclusivevenues.views.LoginView'''
    @classmethod
    def setUpTestData(cls) -> None:
        User.objects.create_user('loginview', password='login-password')
        User.objects.create_user('loginview2', password='login-password2')

    def test_login_valid(self):
        '''Log in with valid credentials'''
        data = self.client.post(
            '/api/login', {'username': 'loginview', 'password': 'login-password'}).json()
        self.assertDictEqual(
            data, {'firstName': '', 'lastName': '', 'username': 'loginview'})
        self.client.logout()

    def test_login_logged_in(self):
        '''Log in as another user when already logged in'''
        self.assertTrue(self.client.login(
            username='loginview', password='login-password'))
        data = self.client.post(
            '/api/login', {'username': 'loginview2', 'password': 'login-password2'}).json()
        self.assertDictEqual(
            data, {'firstName': '', 'lastName': '', 'username': 'loginview2'})
        self.client.logout()

    def test_login_empty(self):
        '''Log in with empty request body'''
        response = self.client.post('/api/login', {})
        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'detail': 'Incorrect username or password'})

    def test_login_blank(self):
        '''Log in with blank credentials'''
        response = self.client.post(
            '/api/login', {'username': '', 'password': ''})
        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'detail': 'Incorrect username or password'})

    def test_login_wrong_username(self):
        '''Log in with wrong username'''
        response = self.client.post(
            '/api/login', {'username': 'viewlogin', 'password': 'login-password'})
        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'detail': 'Incorrect username or password'})

    def test_login_wrong_password(self):
        '''Log in with wrong password'''
        response = self.client.post(
            '/api/login', {'username': 'loginview', 'password': 'password-login'})
        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'detail': 'Incorrect username or password'})

    def test_login_wrong_details(self):
        '''Log in with wrong username and password'''
        response = self.client.post(
            '/api/login', {'username': 'viewlogin', 'password': 'password-login'})
        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(
            response.json(), {'detail': 'Incorrect username or password'})


class LogoutViewTestCase(TestCase):
    '''TestCase for inclusivevenues.views.LogoutView'''
    @classmethod
    def setUpTestData(cls) -> None:
        User.objects.create_user('logoutview', password='logout-password')

    def test_logout_valid(self):
        '''Log out logged-in user'''
        self.assertTrue(self.client.login(
            username='logoutview', password='logout-password'))
        response = self.client.post('/api/logout')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(response.content), 0)

    def test_logout_anonymous(self):
        '''Try to log out logged-out user'''
        self.client.logout()
        response = self.client.post('/api/logout')
        self.assertEqual(response.status_code, 401)
        self.assertDictEqual(response.json(), {'detail': 'Not logged in'})
