from django.urls import path

from . import views

app_name = "task_planner"
urlpatterns = [
    path("topic/", views.TopicList.as_view(), name="topic-list"),
    path("time/", views.TimeList.as_view(), name="time-list"),
    path("tasks/", views.TaskViewSet.as_view({'get': 'list', 'post': 'create'}), name="task-viewset"),
    path("tasks/<int:pk>/", views.TaskViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name="task-detail"),
]
