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