from django.db import models
from django.contrib.auth import get_user_model


# Create your models here.
User = get_user_model()


class Topic(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topics = models.ManyToManyField(Topic)


class Time(models.Model):
    start_time = models.TimeField
    end_time = models.TimeField
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
