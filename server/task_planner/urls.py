from django.urls import path

from . import views

app_name = "task_planner"
urlpatterns = [
    path("task/", views.TaskList.as_view(), name="task-list"),
    path("topic/", views.TopicList.as_view(), name="topic-list"),
    path("time/", views.TimeList.as_view(), name="time-list"),
]
