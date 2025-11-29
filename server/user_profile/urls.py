from django.urls import path

from . import views

app_name = "user_profiles"
urlpatterns = [
    path("profile/<int:pk>/", views.UserProfileDetail.as_view(), name="user-list"),
    path("profile/", views.UserProfileList.as_view(), name="profile-list"),
    path("", views.UserList.as_view(), name="list"),
]
