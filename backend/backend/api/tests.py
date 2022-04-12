from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate
from api.models import Catalogue, CatalogueFic, Fic, Author, FicAuthor
import json
from rest_framework.authtoken.models import Token

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


# ----- TEST CATALOGUE FUNCTIONS ----- #
class CatalogueTest(TestCase):
    # In set up, a user is created that will be used in the tests
    # A catalogue with fanfictions will also be created
    # Client is also initialised
    def setUp (self):
        # User is created
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()

        # Client is initialised
        self.client = Client()

        # Catalogue is created
        self.catalogue = Catalogue(title='Test Catalogue', user=self.user)
        self.catalogue.save()

        # Create author
        self.author = Author(username='testauthor')
        self.author.save()

        # Create fanfiction
        self.fanfiction = Fic(workid=1000, title='Test Fic 1', summary='Test Summary 1')
        self.fanfiction.save()
        self.fanfiction.authors.add(self.author)
        self.fanfiction.save()

        # Add fanfiction to catalogue
        self.cataloguefic = CatalogueFic(catalogue=self.catalogue, fic=self.fanfiction)
        self.cataloguefic.save()

        # Create second user 
        self.user2 = User.objects.create_user(username='testuser2', email='test2@test.com')
        self.user2.set_password('testPassword1!')
        self.user2.save()

        # Create catalogue for user 2
        self.catalogue2 = Catalogue(title='Test Catalogue User 2', user=self.user2)
        self.catalogue2.save()

        # Create second fanfiction
        self.fanfiction2 = Fic(workid=1001, title='Test Fic 2', summary='Test Summary 2')
        self.fanfiction2.save()
        self.fanfiction2.authors.add(self.author)
        self.fanfiction2.save()

    

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()
        self.token.delete()
        self.author.delete()
        self.catalogue.delete()
        self.fanfiction.delete()
        self.cataloguefic.delete()
        self.user2.delete()
        self.catalogue2.delete()

    # Test that catalogue is created successfully when given a unique title
    def test_successful_create_catalogue(self):
        catalogueDetails = {'title': 'Test Catalogue 2'}
        self.response = self.client.post('/api/createCatalogue/', data=json.dumps(catalogueDetails), content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 201)

    # Test that catalogue creation fails if the user tries to create a catalgoue
    # with the same title as another catalogue they created
    def test_not_unique_title(self):
        catalogueDetails = {'title': 'Test Catalogue'}
        self.response = self.client.post('/api/createCatalogue/', data=json.dumps(catalogueDetails), content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 409)

    # Test that a 401 is returned if the user is not authorised
    def test_not_authorised_create_catalogue(self):
        catalogueDetails = {'title': 'Test Catalogue 2'}
        self.response = self.client.post('/api/createCatalogue/', data=json.dumps(catalogueDetails), content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test that catalogues of current user are successfully retrieved
    def test_successful_get_catalogues(self):
        self.response = self.client.get('/api/getCatalogues/?userID=0', content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test that catalogues of current user are not successfully retrieved
    # if user does not send authentication token
    def test_not_authorised_get_catalogues(self):
        self.response = self.client.get('/api/getCatalogues/?userID=0', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)
        
    # Test that catalogues of other user are successfully retrieved
    def test_successful_get_other_user_catalogues(self):
        userID = str(self.user2.id)
        self.response = self.client.get('/api/getCatalogues/?userID='+userID, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test that catalogues of other user are not successfully retrieved
    # if user does not send authentication token
    def test_not_authorised_get_other_user_catalogues(self):
        userID = str(self.user2.id)
        self.response = self.client.get('/api/getCatalogues/?userID='+userID, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test that catalogue of current user is retrieved successfully if authorised
    def test_successful_get_catalogue(self):
        catalogueID = str(self.catalogue.id)
        self.response = self.client.get('/api/getCatalogue/?userID=0&catalogueID=' + catalogueID, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test that catalogue of current user is not retrieved if not authorised
    def test_not_authorised_get_catalogue(self):
        userID = str(self.user2.id)
        catalogueID = str(self.catalogue2.id)
        self.response = self.client.get('/api/getCatalogue/?userID=0&catalogueID' + catalogueID, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test that other users' catalogue is retrieved successfully if authorised
    def test_successful_get_other_user_catalogue(self):
        userID = str(self.user2.id)
        catalogueID = str(self.catalogue2.id)
        self.response = self.client.get('/api/getCatalogue/?userID=' + userID + '&catalogueID=' + catalogueID, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test that other user's catalogue is not retrieved if not authorised
    def test_not_authorised_get_other_user_catalogue(self):
        userID = str(self.user2.id)
        catalogueID = str(self.catalogue2.id)
        self.response = self.client.get('/api/getCatalogue/?userID=' + userID + '&catalogueID=' + catalogueID, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Successful delete catalogue
    def test_successful_delete_catalogue(self):
        self.response = self.client.post('/api/deleteCatalogue/', data={'id':str(self.catalogue.id)}, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Trying to delete catalogue that does not exist will return a 204
    # This will ensure that client still thinks the resource is deleted
    def test_delete_non_existent_catalogue(self):
        self.response = self.client.post('/api/deleteCatalogue/', data={'id':164}, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 204)

    # Not successful because not authorised
    def test_not_authorised_delete_catalogue(self):
        self.response = self.client.post('/api/deleteCatalogue/', data={'id':164}, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Trying to delete catalogue of other user will not work
    # Will return a 204 as the authorised user will not have a catalogue
    # with that ID
    def test_delete_catalogue_of_other_user(self):
        self.response = self.client.post('/api/deleteCatalogue/', data={'id':self.catalogue2.id}, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 204)

    # Test that the user cannot attempt to search for fics if not authorised
    # No other tests really needed for this because it just uses AO3 api
    def test_not_authorised_search_fic(self):
        self.response = self.client.get('/api/searchFic/?title=test&author=test', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test that add fic works if user authorised and fic not already in catalogue
    # and catalogue begins to user
    def test_successful_add_fic(self):
        ficDetails = {
            'workid': 1001,
            'title': 'Test Fic 2',
            'summary': 'Test Summary 2',
            'authors': self.author.username,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/addFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 201)


    # Test trying to add fanfiction to a catalogue that it is already in
    # Should respond with a 409 for conflict
    def test_add_fic_already_in_catalogue(self):
        ficDetails = {
            'workid': 1000,
            'title': 'Test Fic 1',
            'summary': 'Test Summary 1',
            'authors': self.author.username,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/addFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 409)


    # Test trying to add to catalogue that does not exist
    # Should return a 400
    def test_add_fic_catalogue_doesnt_exist(self):
        ficDetails = {
            'workid': 1000,
            'title': 'Test Fic 1',
            'summary': 'Test Summary 1',
            'authors': self.author.username,
            'catalogueID': 164,
        }
        self.response = self.client.post('/api/addFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 400)

    # Test trying to add to catalogue that belongs to someone else
    # Should return a 400
    def test_add_fic_other_user_catalogue(self):
        ficDetails = {
            'workid': 1001,
            'title': 'Test Fic 2',
            'summary': 'Test Summary 2',
            'authors': self.author.username,
            'catalogueID': self.catalogue2.id,
        }
        self.response = self.client.post('/api/addFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 400)

    # Test trying to add fanfiction to catalogue if not authorised
    # Should return 401
    def test_not_authorised_add_fic(self):
        ficDetails = {
            'workid': 1001,
            'title': 'Test Fic 2',
            'summary': 'Test Summary 2',
            'authors': self.author.username,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/addFic/', data=ficDetails, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test adding a fanfic that does not exist in database yet
    # Should returns 201
    def test_add_fic_not_yet_in_db(self):
        ficDetails = {
            'workid': 2000,
            'title': 'Test Fic New',
            'summary': 'Test Summary New',
            'authors': self.author.username,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/addFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 201)


    # Test remove fic successfully
    # Should return 200
    def test_successful_remove_fic(self):
        ficDetails = {
            'ficID': 1000,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/removeFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Try remove fic that doesn't exist 
    def test_remove_fic_doesnt_exist(self):
        ficDetails = {
            'ficID': 2000,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/removeFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 204)

    # Try remove fic that isn't in catalogue (but does exist!) 
    def test_remove_fic_doesnt_exist(self):
        ficDetails = {
            'ficID': 1001,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/removeFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 204)

    # Try remove from catalogue that doesn't exist
    def test_remove_fic_catalogue_doesnt_exist(self):
        ficDetails = {
            'ficID': 1000,
            'catalogueID': 164,
        }
        self.response = self.client.post('/api/removeFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 204)

    # Try remove from catalogue that belongs to other user
    def test_remove_fic_other_user_catalogue(self):
        ficDetails = {
            'ficID': 1000,
            'catalogueID': self.catalogue2.id,
        }
        self.response = self.client.post('/api/removeFic/', data=ficDetails, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 204)

    # Test not authorised
    def test_not_authorised_remove_fic(self):
        ficDetails = {
            'ficID': 1000,
            'catalogueID': self.catalogue.id,
        }
        self.response = self.client.post('/api/removeFic/', data=ficDetails, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)


# ----- TEST DASHBOARD FUNCTIONS ----- #
class DashboardTest(TestCase):
    # In set up, a user is created that will be used in the tests
    # A catalogue with fanfictions will also be created
    # Client is also initialised
    def setUp (self):
        # User is created
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()
        self.token.delete()


    # Test successful get dashboard data (recent activity)
    def test_successful_get_dashboard_data(self):
        self.response = self.client.get('/api/getDashboardData/', data={'page': 1}, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test unauthorised get dashboard data
    def test_not_authorised_get_dashboard_data(self):
        self.response = self.client.get('/api/getDashboardData/', data={'page': 1},  content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test invalid page number
    # Should return 400
    def test_invalid_page_number(self):
        self.response = self.client.get('/api/getDashboardData/', data={'page': -1}, content_type='application/json',  **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 400)


# ----- TEST PROFILE FUNCTIONS ----- #
class ProfileTest(TestCase):
    # In set up, two user are created that will be used in the tests
    # Client is also initialised
    def setUp (self):
        # User is created
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()

        # Create second user
        self.user2 = User.objects.create_user(username='testuser2', email='test2@test.com')
        self.user2.set_password('testPassword1!')
        self.user2.save()

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()
        self.token.delete()

    # Test successfully get current user profile
    def test_successful_get_user_info(self):
        self.response = self.client.get('/api/getUserInfo/?id=0', content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test not authorised to get current user profile
    def test_not_authorised_get_user_info(self):
        self.response = self.client.get('/api/getUserInfo/?id=0', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test successfully get other user profile
    def test_successful_get_user_info(self):
        userID = str(self.user2.id)
        self.response = self.client.get('/api/getUserInfo/?id=' + userID, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    # Test not authorised to get other user profile
    def test_successful_get_user_info(self):
        userID = str(self.user2.id)
        self.response = self.client.get('/api/getUserInfo/?id=' + userID, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    # Test try to get user profile of user that doesn't exist
    def test_non_existent_user_profile(self):
        self.response = self.client.get('/api/getUserInfo/?id=164', content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 400)


# ----- TEST SETTING FUNCTIONS ----- #
class SettingTest(TestCase):
    # In set up, two users are created that will be used in the tests
    # Client is also initialised
    def setUp (self):
        # User is created
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()

        # Create second user
        self.user2 = User.objects.create_user(username='testuser2', email='test2@test.com')
        self.user2.set_password('testPassword1!')
        self.user2.save()

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()
        self.token.delete()
        self.user2.delete()

    # Test username successful change username - unique username, correct password, authorised
    def test_successful_change_username(self):
        details = {
            'newUsername': 'updated_testuser',
            'password': 'testPassword1!',
        }
        self.response = self.client.post('/api/changeUsername/', data=details, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)
    
    def test_not_authorised_change_username(self):
        details = {
            'newUsername': 'updated_testuser',
            'password': 'testPassword1!',
        }
        self.response = self.client.post('/api/changeUsername/', data=details, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    def test_username_already_exists(self):
        details = {
            'newUsername': 'testuser2',
            'password': 'testPassword1!',
        }
        self.response = self.client.post('/api/changeUsername/', data=details, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 409)

    def test_incorrect_password_cu(self):
        details = {
            'newUsername': 'updated_testuser',
            'password': 'incorrect_password',
        }
        self.response = self.client.post('/api/changeUsername/', data=details, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 403)

    def test_successful_change_password(self):
        details = {
            'oldPassword': 'testPassword1!',
            'newPassword': 'testPassword2!',
            'confirmNewPassword': 'testPassword2!',
        }
        self.response = self.client.post('/api/changePassword/', data=details, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)
    
    def test_not_authorised_change_password(self):
        details = {
            'oldPassword': 'testPassword1!',
            'newPassword': 'testPassword2!',
            'confirmNewPassword': 'testPassword2!',
        }
        self.response = self.client.post('/api/changePassword/', data=details, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    def test_password_fail_criteria(self):
        details = {
            'oldPassword': 'testPassword1!',
            'newPassword': 'test',
            'confirmNewPassword': 'test',
        }
        self.response = self.client.post('/api/changePassword/', data=details, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 403)

    def test_incorrect_password_cp(self):
        details = {
            'oldPassword': 'test',
            'newPassword': 'testPassword2!',
            'confirmNewPassword': 'testPassword2!',
        }
        self.response = self.client.post('/api/changePassword/', data=details, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 403)
        

    def test_successful_logout(self):
        self.response = self.client.get('/api/auth/logout/', content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)
    
    def test_not_authorised_logout(self):
        self.response = self.client.get('/api/auth/logout/', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)


# ----- TEST FRIENDS FUNCTIONS ----- #
class FriendTest(TestCase):
    # In set up, two users are created that will be used in the tests
    # Client is also initialised
    def setUp (self):
        # User is created
        self.user = User.objects.create_user(username='testuser', email='test@test.com')
        self.user.set_password('testPassword1!')
        self.user.save()
        self.token = Token.objects.create(user=self.user)
        self.token.save()

        # Create second user
        self.user2 = User.objects.create_user(username='testuser2', email='test2@test.com')
        self.user2.set_password('testPassword1!')
        self.user2.save()

    # Runs after tests are completed to clean up testing database
    def tearDown(self):
        self.user.delete()
        self.token.delete()
        self.user2.delete()

    def test_successful_get_friends(self):
        self.response = self.client.get('/api/getFriends/', content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    def test_not_authorised_get_friends(self):
        self.response = self.client.get('/api/getFriends/', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    def test_successful_search_users(self):
        self.response = self.client.get('/api/searchUsers/?username=testuser2', content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    def test_not_authorised_search_users(self):
        self.response = self.client.get('/api/searchUsers/?username=testuser2', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    def test_successful_get_friend_requests(self):
        self.response = self.client.get('/api/getFriendRequests/', content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    def test_not_authorised_get_friend_requests(self):
        self.response = self.client.get('/api/getFriendRequests/', content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    def test_successful_accept_friend_request(self):
        self.response = self.client.post('/api/acceptFriendRequest/', {'id': self.user2.id}, content_type='application/json', **{'HTTP_AUTHORIZATION': f'Token {self.token}'})
        self.assertEqual(self.response.status_code, 200)

    def test_not_authorised_accept_friend_request(self):
        self.response = self.client.post('/api/acceptFriendRequest/', {'id': self.user2.id}, content_type='application/json')
        self.assertEqual(self.response.status_code, 401)

    #def test_successful_deny_friend_request(self):

    #def test_not_authorised_deny_friend_request(self):

    #def test_successful_send_friend_request(self):

    #def test_not_authorised_send_friend_request(self):

    #def test_successful_has_friend_requests(self):

    #def test_not_authorised_has_friend_requests(self):

    #def test_successful_remove_friend(self):

    #def test_not_authorised_remove_friend(self):



    #'getFriends/'
    #'searchUsers/'
    #'getFriendRequests/'
    #'acceptFriendRequest/'
    #'denyFriendRequest/'
    #'sendFriendRequest/'
    #'hasFriendRequests/'
    #'removeFriend/'
