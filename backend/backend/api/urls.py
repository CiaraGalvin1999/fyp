from rest_framework.authtoken.views import obtain_auth_token
from .views import CreateUserAPIView, LogoutUserAPIView
from . import views
from django.urls import path

urlpatterns = [
    # Login path - returns token and user id in response
    path('auth/login/', obtain_auth_token, name='auth_user_login'),
    # Registration path
    path('auth/register/', CreateUserAPIView.as_view(), name='auth_user_create'),
    # Logout path - deletes token
    path('auth/logout/', LogoutUserAPIView.as_view(), name='auth_user_logout'),
    # Search fic path - returns list of fics based on title and author sent in request
    path('searchFic/', views.searchFic, name='search_fic'),
    # Add fic to a specified catalogue
    path('addFic/', views.addFic, name='add_fic'),
    # Get list of catalogues for specific user
    path('getCatalogues/', views.getCatalogues, name='get_catalogues'),
    # Get specific catalogue and return all info including fics
    path('getCatalogue/', views.getCatalogue, name='get_catalogue'),
    # Create a new catalogue
    path('createCatalogue/', views.createCatalogue, name='create_catalogue'),
    # Get info needed for profile view
    path('getUserInfo/', views.getUserInfo, name='get_user_info'),
    # Get list of users friends
    path('getFriends/', views.getFriends, name='get_friends'),
    # Search for users
    path('searchUsers/', views.searchUsers, name='search_users'),
    # Get friend requests for user
    path('getFriendRequests/', views.getFriendRequests, name='get_friend_requests'),
    # Accept friend request
    path('acceptFriendRequest/', views.acceptFriendRequest, name='accept_friend_request'),
    # Deny friend request
    path('denyFriendRequest/', views.denyFriendRequest, name='deny_friend_reqeust'),
    # Send friend request
    path('sendFriendRequest/', views.sendFriendRequest, name='send_friend_request'),
    # Check if user has friend requests
    path('hasFriendRequests/', views.hasFriendRequests, name='has_friend_requests'),
    # Remove friend
    path('removeFriend/', views.removeFriend, name='remove_friend'),
    # Remove fic from catalogue
    path('removeFic/', views.removeFic, name='remove_fic'),
    # Delete catalogue
    path('deleteCatalogue/', views.deleteCatalogue, name='delete_catalogue'),
    # Change password
    path('changePassword/', views.changePassword, name='change_password'),
    # Change username
    path('changeUsername/', views.changeUsername, name='change_username')
]