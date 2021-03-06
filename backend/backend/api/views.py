# ----- IMPORTS ----- #
# AO3 Third Party API
import AO3

# json library to work with JSON data
import json

# Itertools for efficient loops
from itertools import chain

# Libraries for working with REST framework
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from rest_framework.generics import CreateAPIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

# Django auth user model
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate

# Custom models and custom serializers
from api.serializers import CreateUserSerializer
from api.models import Catalogue, CatalogueFic, Fic, Author, FicAuthor

# Friendship library for friend functionality
from friendship.models import Friend, FriendshipRequest, Follow, Block

# Regex
import re


# Function that checks if password passes criteria/requirements
# Requirements:
# Password must be at least 8 characters long.
# It must be a mix of both upper and lowercase letters.
# It should be a mix of letters and numbers.
# It must contain at least one special character (. , ! ? @ #)
def checkPasswordCriteria(password):
    # Checks length
    if len(password) < 8:
        return False
    
    # Checks if there is a combination of letters and numbers
    numsAndLetters = any(l.isalpha() for l in password) and any(l.isnumeric() for l in password)
    if not numsAndLetters:
        return False

    
    # Checks that there is a mix of combination of upper and lowercase characters
    # Boolean is true if there is at least one upper and one lower
    isCombination = any(l.islower() for l in password) and any(l.isupper() for l in password)
    if not isCombination:
        return False

    # Check that password has a special character
    # List of special characters
    specialChars = ['.', ',', '!', '?', '@', '#']

    # Boolean is true if there is at least 1 special character
    hasSpecialChar = any(l in specialChars for l in password)
    if not hasSpecialChar:
        return False

    # Return true if all criteria are met
    return True

#User view
class CreateUserAPIView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Can put checks here
        # request.data.password etc...

        body = json.loads(request.body)
        username = body['username']
        email = body['email']
        password = body['password']

        # Form a valid email must take (example@example.com)
        email_form = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$' 
    
        # Check if username or email have already been taken
        # If both have been taken
        if User.objects.filter(username=username).exists() & User.objects.filter(email=email).exists(): 
            return Response('Sorry, both the username and email you have entered have already been taken.', status=status.HTTP_409_CONFLICT)

        # If username has been taken
        elif User.objects.filter(username=username).exists():
            return Response('Sorry, this username has already been taken.', status=status.HTTP_409_CONFLICT)

        elif len(username) < 5:
            return Response('Sorry, this username is too short. Must be at least 5 characters long.', status=status.HTTP_403_FORBIDDEN)

        # If email has been taken
        elif User.objects.filter(email=email).exists():
            return Response('Sorry, this email has already been used to create an account.', status=status.HTTP_409_CONFLICT)
        
        # If email is not valid (i.e., not in the form example@example.com)
        elif not re.search(email_form, email):
            return Response('Sorry, this email is invalid. Must be in the form example@example.com.', status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        # Check that password meets requirements
        elif not checkPasswordCriteria(password):
            return Response('The password must:\nBe at least 8 characters long\nContain a mix of both upper and lowercase letters\nContain letters and numbers\nContain at least one special character (. , ! ? @ #)', status=status.HTTP_403_FORBIDDEN)


        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Calls default serializer save function which calls custom create function
            # Serializer source code - https://stackoverflow.com/questions/53319230/what-is-the-difference-between-the-create-and-perform-create-methods-in-django-r
            # Example of how it calls my create function - https://github.com/encode/django-rest-framework/blob/a53e523f939332189b4ba8db7f99758b7d63e59b/rest_framework/serializers.py#L211
            self.perform_create(serializer)

            headers = self.get_success_headers(serializer.data)
            
            #Token is created - This will be used to authorize the user in the future
            token = Token.objects.create(user=serializer.instance)
            token_data = {"token": token.key}
            
            return Response(
                {**serializer.data, **token_data},
                status=status.HTTP_201_CREATED,
                headers=headers
            )

#Logout deletes the previously created authorization token
class LogoutUserAPIView(APIView):
    queryset = get_user_model().objects.all()

    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

# Allows a user to search for a fanfiction based on title and author
@api_view(('GET',))
def searchFic(request):
    # Gets author and title from the request
    title = request.GET.get('title')
    author = request.GET.get('author')

    # Performs a search for this title and author
    search = AO3.Search(author=author, title=title)
    search.update()

    # Data will be a list of JSON objects
    data = []

    # Create new JSON object for each result
    for result in search.results:
        # ID
        workid = result.id
        # Title
        title = result.title
        # Add authors - can have multiple authors
        # authors is a list
        authors = []
        for author in result.authors:
            authors.append(author.username)

        # Summary - can be empty
        if result.summary == None:
            summary = ''
        else:
            summary = result.summary
        
        # Create object
        resultJSON = {'id': workid, 'title': title, 'summary': summary, 'authors': authors}
        data.append(resultJSON)

    # Convert object to JSON and send to client in response
    data = json.dumps(data)
    return Response(data)

@api_view(('POST',))
def addFic(request):
    # Get workid of fanfic
    body = json.loads(request.body)
    workid = body['workid']
    title = body['title']
    summary = body['summary']
    authors = body['authors']
    catalogueID = body['catalogueID']

    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get catalogue and make sure it exists and that it belongs to authenticated user
    if not Catalogue.objects.filter(id=catalogueID, user=user).exists():
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Get catalogue
    catalogue = Catalogue.objects.get(id=catalogueID, user=user)

    # Check if fic is already in database
    # If already in the database, add fanfiction to catalogue
    if Fic.objects.filter(workid=workid).exists():
        fic = Fic.objects.get(workid=workid)

        #Check if fanfiction is already in catalogue
        # If it is, return 409 for conflict
        if CatalogueFic.objects.filter(catalogue=catalogue, fic=fic).exists():
            return Response(status=status.HTTP_409_CONFLICT)

        # Otherwise add fic to catalogue
        else:
            catalogue.fics.add(fic)
            catalogue.save()
        

    # If the fanfiction is not already in the catalogue, must add the fanfiction to the database
    # And add associated authors to database if they aren't already in it

    else: 
        # First check authors - add any not in db to db
        # Also create list of authors to be associated with fanfiction
        ficAuthors = []
        for a in authors:
            if not Author.objects.filter(username=a).exists():
                author = Author(username=a)
                author.save()
            
            ficAuthors.append(Author.objects.get(username=a))
        
        # Then add fanfiction to database
        fic = Fic(workid=workid, title=title, summary=summary)
        fic.save()
        fic.authors.set(ficAuthors)
        fic.save()

        catalogue.fics.add(fic)
        catalogue.save()

    # Return success response
    return Response(status=status.HTTP_201_CREATED)   

# TO DO
# Put in a check to ensure that the work/fic still exists - if it doesnt, delete this from the database
# (Make seperate function to do this)
@api_view(('GET',))
def getCatalogues(request):
    userID = int(request.GET.get('userID'))

    if userID != 0:
        user = User.objects.get(id=userID)

    else:
        # Get token and associated user
        auth = request.headers.get("Authorization", None)
        token = auth[6:]
        user = Token.objects.get(key=token).user

    # Get all catalogues associated with user and return
    catalogues = Catalogue.objects.filter(user=user)

    # Create json array of catalogues (title and id only) and return in response 
    data = []
    for catalogue in catalogues:
        data.append(catalogue.title_and_id())
    data = json.dumps(data)

    return Response(data)

@api_view(('GET',))
def getCatalogue(request):
    # Get catalogue ID sent in request
    catalogueID = int(request.GET.get('catalogueID'))

    # Get catalogue associated with ID in dictionary form
    catalogue = Catalogue.objects.get(id=catalogueID).to_dict()

    # Convert catalogue to JSON and send in response
    data = json.dumps(catalogue)
    return Response(data)

@api_view(('POST',))
def createCatalogue(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get title
    body = json.loads(request.body)
    title = body['title']

    # Check if user already has a catalogue with that title
    if Catalogue.objects.filter(user=user, title=title).exists():
        return Response(status=status.HTTP_409_CONFLICT)

    # Create catalogue
    catalogue = Catalogue(title=title, user=user)
    catalogue.save()

    # Returns catalogue id
    return Response(catalogue.id, status=status.HTTP_201_CREATED)

@api_view(('POST',))
def removeFic(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get ID of catalogue and fanfic
    body = json.loads(request.body)
    ficID = body['ficID']
    catalogueID = body['catalogueID']

    # Check that catalogue exists and belongs to user
    # If not, return a 204
    if not Catalogue.objects.filter(user=user, id=catalogueID).exists():
        return Response(status=status.HTTP_204_NO_CONTENT)

    # If it does, check that fanfiction is in catalogue
    # Get catalogue
    catalogue = Catalogue.objects.get(user=user, id=catalogueID)

    # Check that fic exists
    # If not return 204
    if not Fic.objects.filter(workid=ficID).exists():
        return Response(status=status.HTTP_204_NO_CONTENT)

    # If it exists, check that it is in catalogue
    fic = Fic.objects.get(workid=ficID)

    # If not in catalogue, return a 204
    if not CatalogueFic.objects.filter(catalogue=catalogue, fic=fic).exists():
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Otherwise remove fanfic from catalogue
    catalogue.fics.remove(fic)
    catalogue.save()

    # Return success response
    return Response(status=status.HTTP_200_OK)

@api_view(('POST',))
def deleteCatalogue(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get ID of catalogue
    body = json.loads(request.body)
    catalogueID = body['id']

    # If catalogue does not exist, return a 204
    if not (Catalogue.objects.filter(user=user, id=catalogueID)).exists():
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Otherwise get catalogue and delete it
    catalogue = Catalogue.objects.get(user=user, id=catalogueID)
    catalogue.delete()

    # Return success response
    return Response(status=status.HTTP_200_OK)

@api_view(('GET',))
def getUserInfo(request):
    # Get id sent in request
    userID = int(request.GET.get('id'))
    
    # If it's not 0, then find user with associated id
    if userID != 0:

        # Check that user exists
        # If not, return 400
        if not User.objects.filter(id=userID).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.get(id=userID)

    # Otherwise get info of logged in user (id sent in request will be 0)
    else:
        auth = request.headers.get("Authorization", None)
        token = auth[6:]
        user = Token.objects.get(key=token).user

    # Get number of catalogues associated with user
    catalogues = Catalogue.objects.filter(user=user).order_by('-id')
    numCatalogues = catalogues.count()

    recentCatalogues = catalogues[:6]

    # Create array of catalogues (title and id only)
    recentCats = []
    for catalogue in recentCatalogues:
        recentCats.append(catalogue.title_and_id())
    
    # Get number of friends
    numFriends = len(Friend.objects.friends(user))

    recentActivity = getRecentActivityUser(user)
        
    # Add username of user, number of catalogues they have, 6 most recent catalogues etc, ...... to data to be returned
    data = {'username': user.username, 'numCatalogues': numCatalogues, 'numFriends': numFriends, 'recentCatalogues': recentCats, 'recentActivity': recentActivity}

    # Respond with user data
    data = json.dumps(data)
    return Response(data)

def getRecentActivityUser(user):
    # Get current activity of user

    # Get recently created catalogues and recently added fics
    recentCatalogues = Catalogue.objects.filter(user=user).order_by('-created_at')
    recentFics = CatalogueFic.objects.filter(catalogue__user=user).order_by('-created_at')

    # Sort by created_at
    recentActivity = sorted(
        chain(recentCatalogues, recentFics),
        key=lambda ra: ra.created_at, reverse=True)
    # Reduce to top 10 results
    recentActivity = recentActivity[:10]

    # Put in JSON format and return
    # Also added type so frontend knows whether its a new catalogue or a new fic in a catalogue
    activity = []
    for a in recentActivity:
        if isinstance(a, Catalogue):
            data = a.recentActivityData()
            data['type'] = 'New Catalogue'
            activity.append(data)
        else: 
            data = a.as_dict()
            data['type'] = 'New Fic'
            activity.append(data)
    return json.dumps(activity)

# ----- FRIEND RELATED FUNCTIONS ----- #
@api_view(('GET',))
def getFriends(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get friends of authenticated user
    friends = Friend.objects.friends(user)

    # Create array of objects containing friends' info (id, username)
    data = []
    for f in friends:
        username = f.username
        friendID = f.id
        friend = {'username': username, 'id': friendID}
        data.append(friend)

    # Convert to json object and send in response
    data = json.dumps(data)
    return Response(data)

@api_view(('GET',))
def searchUsers(request):
    # Get username of logged in user that searched for other users
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get username sent in request/searched for
    username = request.GET.get('username')

    data = getUsersNotFriendsWith(user, username)
    
    data = json.dumps(data)
    return Response(data)

def getUsersNotFriendsWith(currentUser, username):
    currentUsername = currentUser.username

    # Search for this user with partial matches
    users = User.objects.filter(username__icontains=username)

    # Exclude current user from results if in it
    users = users.exclude(username__contains=currentUsername)

    # Get users friends
    friends = Friend.objects.friends(currentUser)

    # Exclude users that current user is already friends with
    for f in friends: 
        users = users.exclude(username__contains=f.username)

    # Only returns max 15 people
    users = users[:15]

    # Create JSON response that contains username and ID of users in result
    data = []

    # Get username, id, and whether or not a friend request already exists
    for u in users:
        username = u.username
        userID = u.id

        # s if currentUser has sent a request
        # r if currentUser has received a request
        # n if request does not exist

        if FriendshipRequest.objects.filter(from_user=u, to_user=currentUser).exists():
            requestStatus = 'r'
        elif FriendshipRequest.objects.filter(from_user=currentUser, to_user=u).exists():
            requestStatus = 's'
        else:
            requestStatus = 'n'

        user = {'username': username, 'id': userID, 'requestStatus': requestStatus}
        data.append(user)

    return data

@api_view(('GET',))
def getFriendRequests(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get friend requests for associated user
    friendRequests = Friend.objects.unread_requests(user=user)

    data = []

    for request in friendRequests: 
        user = request.from_user
        username = user.username
        userID = user.id

        friendRequest = {'username': username, 'id': userID}
        data.append(friendRequest)

    data = json.dumps(data)

    # Return success response
    return Response(data)

@api_view(('POST',))
def acceptFriendRequest(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    currentUser = Token.objects.get(key=token).user

    # Get user that sent request
    body = json.loads(request.body)
    userID = body['id']

    # Make sure user exists
    # If they don't, return a 400
    if not User.objects.filter(id=userID):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    # Otherwise get user
    otherUser = User.objects.get(id=userID)

    # If friend request doesn't exist, return a 400
    if not FriendshipRequest.objects.filter(from_user=otherUser, to_user=currentUser):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Otherwise accept friend request
    friend_request = FriendshipRequest.objects.get(from_user=otherUser, to_user=currentUser)
    friend_request.accept()

    # Return success response
    return Response(status=status.HTTP_200_OK)

@api_view(('POST',))
def denyFriendRequest(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    currentUser = Token.objects.get(key=token).user

    # Get user that sent request
    body = json.loads(request.body)
    userID = body['id']

    # Make sure user exists
    # If they don't, return a 400
    if not User.objects.filter(id=userID):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    # Otherwise retrieve user from database
    otherUser = User.objects.get(id=userID)

    # If friend request doesn't exist, return a 400
    if not FriendshipRequest.objects.filter(from_user=otherUser, to_user=currentUser):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Otherwise deny friend request
    friend_request = FriendshipRequest.objects.get(from_user=otherUser, to_user=currentUser)
    friend_request.delete()
    
    # Return success response
    return Response(status=status.HTTP_200_OK)

@api_view(('POST',))
def sendFriendRequest(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    currentUser = Token.objects.get(key=token).user

    # Get other user
    body = json.loads(request.body)
    userID = body['id']

    # Make sure user exists
    # If they don't, return a 400
    if not User.objects.filter(id=userID):
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Otherwise retrieve user from database
    otherUser = User.objects.get(id=userID)

    # Check if user are already friends, and if so, return a 403
    if Friend.objects.are_friends(currentUser, otherUser):
        return Response(status=status.HTTP_403_FORBIDDEN)

    # If user has already sent a friend request return a 204
    if FriendshipRequest.objects.filter(from_user=currentUser, to_user=otherUser).exists():
        return Response(status=status.HTTP_204_NO_CONTENT)

    # If other user has sent a friend request, return a 403
    if FriendshipRequest.objects.filter(from_user=otherUser, to_user=currentUser).exists():
        return Response(status=status.HTTP_403_FORBIDDEN)

    # Otherwise user successfully sends friend request
    Friend.objects.add_friend(currentUser, otherUser)                             

    # Return success response
    return Response(status=status.HTTP_201_CREATED)

@api_view(('GET',))
def hasFriendRequests(request):
        # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    data = {}
     # Get friend requests for associated user
    if len(Friend.objects.unread_requests(user=user)) > 0:
        data = {'hasFriendRequests': 'true'}
    else:
        data = {'hasFriendRequests': 'false'}
    
    data = json.dumps(data)
    return Response(data)

@api_view(('POST',))
def removeFriend(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    currentUser = Token.objects.get(key=token).user

    # Get other user
    body = json.loads(request.body)
    userID = body['id']
    
     # Make sure user exists
    # If they don't, return a 400
    if not User.objects.filter(id=userID):
        return Response(status=status.HTTP_403_FORBIDDEN)

    # Otherwise retrieve user from database
    otherUser = User.objects.get(id=userID)

    # Check if users are not friends, return a 204
    if not Friend.objects.are_friends(currentUser, otherUser):
        return Response(status=status.HTTP_204_NO_CONTENT)

    # Otherwise remove friendship
    Friend.objects.remove_friend(currentUser, otherUser)                        

    # Return success response
    return Response(status=status.HTTP_200_OK)

# ----- SETTINGS RELATED FUNCTIONS ----- #

# Change password of authenticated user
@api_view(('POST',))
def changePassword(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    body = json.loads(request.body)
    oldPassword = body['oldPassword']
    newPassword = body['newPassword']
    confirmNewPassword = body['confirmNewPassword']

    # Authenticate user by making sure they entered correct password
    user = authenticate(username=user.username, password=oldPassword)
    if user is not None:
        # Credentials have been authenticated
        # Check if newPassword and confirmNewPassword match
        if newPassword == confirmNewPassword:

            # Make sure that new password meets requirements
            # If not, return 403
            if not checkPasswordCriteria(newPassword):
                return Response(status=status.HTTP_403_FORBIDDEN)
            # Otherwise set new password
            user.set_password(newPassword)
            user.save()
        # Return 400 if passwords dont match
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    else:
        # Authentication failed - wrong password
        return Response(status=status.HTTP_403_FORBIDDEN)
                          

    # Return success response
    return Response(status=status.HTTP_200_OK)


# Change username of authenticated user
@api_view(('POST',))
def changeUsername(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    body = json.loads(request.body)
    newUsername = body['newUsername']
    password = body['password']

    # Authenticate user by making sure they entered correct password
    user = authenticate(username=user.username, password=password)
    if user is not None:
        # Credentials have been authenticated

        # Check if this username is already taken
        if User.objects.filter(username=newUsername).exists(): 
            return Response(status=status.HTTP_409_CONFLICT)
        
        # If username is not taken, update username
        else:
            user.username = newUsername
            user.save()
        
    else:
        # If user enters incorrect password, return 403 forbidden status
        return Response(status=status.HTTP_403_FORBIDDEN)                      

    # Return success response
    return Response(status=status.HTTP_200_OK)


@api_view(('GET',))
def getDashboardData(request):
    # Get current user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get friends of current user
    friends = Friend.objects.friends(user)

    # Get page number (more data is request when user scrolls to bottom)
    page = int(request.GET.get('page'))

    # If invalid page number, return 400
    if page < 1:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    # Recent catalogues of friends
    recentCatalogues = Catalogue.objects.filter(user__in=friends).order_by('-created_at')[20*(page-1):20*page]
    recentFics = CatalogueFic.objects.filter(catalogue__user__in=friends).order_by('-created_at')[20*(page-1):20*page]

    # Sort by created_at
    recentActivity = sorted(
        chain(recentCatalogues, recentFics),
        key=lambda ra: ra.created_at, reverse=True)


    # Put in JSON format and return
    # Also added type so frontend knows whether its a new catalogue or a new fic in a catalogue
    activity = []
    for a in recentActivity:
        if isinstance(a, Catalogue):
            data = a.recentActivityData()
            data['type'] = 'New Catalogue'
            activity.append(data)
        else: 
            data = a.as_dict()
            data['type'] = 'New Fic'
            activity.append(data)

    activity = json.dumps(activity)
    return Response(activity)