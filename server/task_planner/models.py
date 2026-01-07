from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.
User = get_user_model()

class PlannerDay(models.IntegerChoices):
    MONDAY = 1, "Monday"
    TUESDAY = 2, "Tuesday"
    WEDNESDAY = 3, "Wednesday"
    THURSDAY = 4, "Thursday"
    FRIDAY = 5, "Friday"
    SATURDAY = 6, "Saturday"
    SUNDAY = 7, "Sunday"

class Topic(models.Model):
    name = models.CharField(max_length=255)
    color_hex = models.PositiveIntegerField(validators=[MinValueValidator(0), MaxValueValidator(0xFFFFFF)])
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    topics = models.ManyToManyField(Topic, blank=True)


class Time(models.Model):
    day = models.IntegerField(choices=PlannerDay.choices, default=PlannerDay.MONDAY)
    start_time = models.TimeField()
    end_time = models.TimeField()
    repeating = models.BooleanField(default=False)
    task = models.ForeignKey(
        Task, related_name="times", on_delete=models.CASCADE)
