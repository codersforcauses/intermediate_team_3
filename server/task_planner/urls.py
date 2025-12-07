from django.urls import path

from . import views

app_name = "task_planner"
urlpatterns = [
    path("", views.TaskList.as_view(), name="task-list"),
]
