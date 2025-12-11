from django.db import models
from django.contrib.auth import get_user_model


# Create your models here.
User = get_user_model()


class Topic(models.Model):
    name = models.CharField(max_length=255)
    color_hex = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topics = models.ManyToManyField(Topic)


class Time(models.Model):
    day = models.IntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    repeating = models.BooleanField(default=False)
    task = models.ForeignKey(
        Task, related_name="times", on_delete=models.CASCADE)
