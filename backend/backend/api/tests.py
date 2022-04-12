from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate
from api.models import Catalogue, CatalogueFic, Fic, Author, FicAuthor
import json

# Create your tests here.

# ----- TEST LOGIN ----- #
class LoginTest(TestCase):
    # In set up, a user is created that will be used in the tests
    # Client is also initialised
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.client = Client()

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()

    # Tests that user is authenticated when they enter the correct login details
    def test_valid_credentials(self):
        loginDetails = {'username': 'testuser', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/login/', data=json.dumps(loginDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 200)
    
    # Tests that user is not authenticated when they enter the incorrect username
    def test_invalid_username(self):
        loginDetails = {'username': 'testuser_incorrect', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/login/', data=json.dumps(loginDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 400)

    # Tests that user is not authenticated when they enter the incorrect password
    def test_invalid_password(self):
        loginDetails = {'username': 'testuser', 'password': 'testPassword_incorrect'}
        self.response = self.client.post('/api/auth/login/', data=json.dumps(loginDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 400)


# ----- TEST REGISTRATION ----- #
class RegistrationTest(TestCase):
    # In set up, a user is created that will be used in the tests
    # Client is also initialised
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.client = Client()

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()

    # Tests that user is registered when they enter a unique login, 
    # unique email, and password that passes all criteria
    # Response status code will be 201 as user is created and added to database
    def test_successful_registration(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 201)
    
    # Tests that registration fails if the user tries to register with 
    # a username that has already been taken
    # Response status code will be 409 to signify conflict
    def test_not_unique_username(self):
        registrationDetails = {'username': 'testuser', 'email': 'test2@test.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 409)
    
    def test_short_username(self):
        registrationDetails = {'username': 'test', 'email': 'test2@test.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)

    # Tests that registration fails if the user tries to register with
    # an email that has already been used
    # Response status code will be 409 to signify conflict
    def test_not_unique_email(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test@test.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 409)
    
    #Test that registration fails if email is not valid
    # Response status code will be 422
    # TEST 1: No @ symbol
    def test_no_at_symbol(self):
        registrationDetails = {'username': 'testuser2', 'email': 'testtest.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 422)
    
    # TEST 2: No . 
    def test_no_dot_symbol(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test@testcom', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 422)

    # TEST 3: No characters before the @ symbol
    def test_no_chars_before_at_symbol(self):
        registrationDetails = {'username': 'testuser2', 'email': '@test.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 422)

    # TEST 4: No characters after .
    def test_no_chars_after_dot_symbol(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test@test.', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 422)

    # TEST 5: No characters between @ and .
    def test_no_chars_between_at_and_dot(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test@.com', 'password': 'testPassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 422)

    # Tests that registration fails if the password they enter does not meet requirements
    # TEST 1: Password is less than 8 characters long, response status code should be 403
    def test_short_password(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': 'h1!Test'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)

    # TEST 2: Password does not contain a number, response status code should be 403
    def test_no_number(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': '19@12!1999'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)

    # TEST 3: Password does not contain a number, response status code should be 403
    def test_no_letters(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': 'testPassword!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)

    # TEST 4: Password only contains lowercase letters, response status code should be 403
    def test_no_uppercase(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': 'testpassword1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)

    # TEST 5: Password only contains uppercase letters, response status code should be 403
    def test_no_lowercase(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': 'TESTPASSWORD1!'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)

    # TEST 6: Password does not contain a special character, response status code should be 403
    def test_no_special_char(self):
        registrationDetails = {'username': 'testuser2', 'email': 'test2@test.com', 'password': 'testPassword1'}
        self.response = self.client.post('/api/auth/register/', data=json.dumps(registrationDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 403)