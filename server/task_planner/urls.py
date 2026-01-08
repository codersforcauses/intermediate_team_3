from django.urls import path

from . import views
from .views import ProtectedView
from .views import RegisterView

app_name = "task_planner"
urlpatterns = [
    path("topic/", views.TopicList.as_view(), name="topic-list"),
    path("time/", views.TimeList.as_view(), name="time-list"),
    path("tasks/", views.TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name="task-viewset"),
    path("tasks/<int:pk>/", views.TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name="task-detail"),
    path("tasks/<int:pk>/toggle_complete/", views.TaskViewSet.as_view({'patch': 'toggle_complete'}), name="task-toggle-complete"),
    path("protected/", ProtectedView.as_view()),
    path('register/', RegisterView.as_view()),
]
