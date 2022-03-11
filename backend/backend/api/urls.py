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
    path('addFic/', views.addFic, name='add_fic'),
]