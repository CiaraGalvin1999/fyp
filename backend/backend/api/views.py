from django.contrib.auth import get_user_model
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.views import APIView
from api.serializers import CreateUserSerializer
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from django.contrib.auth.models import User
from api.models import Catalogue, CatalogueFic, Fic, Author, FicAuthor
from friendship.models import Friend, FriendshipRequest, Follow, Block

import AO3
import json

#User view
class CreateUserAPIView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        # Can put checks here
        # request.data.password etc...

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
        # Title
        title = result.title

        # ID
        workid = result.id

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
        
        # Create JSON object
        resultJSON = {'title': title, 'authors': authors, 'id': workid, 'summary': summary}
        data.append(resultJSON)

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

    # Get catalogue
    catalogue = Catalogue.objects.get(id=catalogueID)

    # Check if fic is already saved in database
    fic = Fic.objects.filter(workid=workid)

    # If fic is not in db, add to db
    # Must also add authors if not already in db
    if fic.exists() == False:
        fic = Fic(workid=workid, title=title, summary=summary)
        fic.save()
        for authorUsername in authors: 
            author = Author.objects.filter(username=authorUsername)
            
            if author.exists() == False:
                author = Author(username=authorUsername)
                author.save()

            else:
                author = author[0]

            ficAuthor = FicAuthor(fic=fic, author=author)
            ficAuthor.save()

    else:
        fic = fic[0]

    # Add fanfic to selected catalogue
    catalogueFic = CatalogueFic(catalogue=catalogue, fic=fic)
    catalogueFic.save()

    # Return success response
    return Response(status=status.HTTP_200_OK)




# TO DO
# Put in a check to ensure that the work/fic still exists - if it doesnt, delete this from the database
# (Make seperate function to do this)
@api_view(('GET',))
def getCatalogues(request):
    data = getCataloguesHelper(request)

    return Response(data)

def getCataloguesHelper(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get all catalogues associated with user and return
    catalogues = Catalogue.objects.filter(user=user)
    
    # Create json array of catalogues (inc. title and id) and return in response 
    data = []

    for catalogue in catalogues:
        title = catalogue.title
        catalogueID = catalogue.id

        result = {'title': title, 'id': catalogueID}
        data.append(result)

    data = json.dumps(data)
    return data

@api_view(('GET',))
def getCatalogue(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get ID sent in request
    catalogueID = int(request.GET.get('id'))

    # Get catalogue associated with ID
    catalogue = Catalogue.objects.get(id=catalogueID)

    # Get all fics in the catalogue
    cf = CatalogueFic.objects.filter(catalogue=catalogue)

    # Empty array to add fics to
    fics = []

    # Check to make sure there are fics in the catalogue
    if cf.exists():
        # For every fic in catalogue, add title, workid, authors, and summary to object
        # Then add fic object to fics array created above
        for x in cf:
            fic = x.fic
            
            # Title
            title = fic.title

            # ID
            workid = fic.workid

            # Add authors - can have multiple authors
            # authors is a list
            authors = []
            af = FicAuthor.objects.filter(fic=fic)
            for a in af:
                author = a.author
                authors.append(author.username)

            # Summary - can be empty
            if fic.summary == None:
                summary = ''
            else:
                summary = fic.summary
            
            # Create JSON object
            resultJSON = {'title': title, 'authors': authors, 'workid': workid, 'summary': summary}
            fics.append(resultJSON)

    fics = json.dumps(fics)
    return Response(fics)

@api_view(('POST',))
def createCatalogue(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get title
    body = json.loads(request.body)
    title = body['title']

    # Create catalogue
    catalogue = Catalogue(title=title, user=user)
    catalogue.save()

    data = getCataloguesHelper(request)

    return Response(data)

@api_view(('GET',))
def getUserInfo(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    # Get number of catalogues associated with user
    catalogues = Catalogue.objects.filter(user=user).order_by('-id')
    numCatalogues = catalogues.count()

    recentCatalogues = catalogues[:6]

    catalogues = []
    for c in recentCatalogues:
        title = c.title
        id = c.id
        catalogue = {'title': title, 'id': id}
        catalogues.append(catalogue)

    
    # Get number of friends
    numFriends = len(Friend.objects.friends(user))
        
    # Add username of user, number of catalogues they have, 6 most recent catalogues etc, ...... to data to be returned
    data = {'username': user.username, 'numCatalogues': numCatalogues, 'numFriends': numFriends, 'recentCatalogues': catalogues}

    # Respond with user data
    data = json.dumps(data)
    return Response(data)

@api_view(('GET',))
def getFriends(request):
    # Get token and associated user
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user

    friends = Friend.objects.friends(user)

    data = []

    for f in friends:
        username = f.username
        friendID = f.id
        friend = {'username': username, 'id': friendID}
        data.append(friend)

    data = json.dumps(data)
    return Response(data)


@api_view(('GET',))
def searchUsers(request):
    # Get username of logged in user that searched for other users
    auth = request.headers.get("Authorization", None)
    token = auth[6:]
    user = Token.objects.get(key=token).user
    currentUsername = user.username

    # Get username sent in request/searched for
    username = request.GET.get('username')

    # Search for this user with partial matches
    users = User.objects.filter(username__icontains=username) 

    # Exclude current user from results if in it
    users = users.exclude(username__contains=currentUsername)

    # Get users friends
    friends = Friend.objects.friends(user)

    # Exclude users that current user is already friends with
    for f in friends: 
        users = users.exclude(username__contains=f.username)

    # Create JSON response that contains username and ID of users in result
    data = []

    for u in users:
        username = u.username
        userID = u.id
        user = {'username': username, 'id': userID}
        data.append(user)

    data = json.dumps(data)
    return Response(data)


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
        requestID = request.id

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
    otherUser = User.objects.get(id=userID)

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
    otherUser = User.objects.get(id=userID)

    friend_request = FriendshipRequest.objects.get(from_user=request.user, to_user=other_user)
    friend_request.reject()
    
    # Return success response
    return Response(status=status.HTTP_200_OK)