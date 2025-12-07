from django.contrib import admin

from .models import Task, Time, Topic

# Register your models here.
admin.site.register(Task)
admin.site.register(Time)
admin.site.register(Topic)
