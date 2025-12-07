from django.shortcuts import render

# from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task, Topic, Time
from .serializers import TaskSerializer, TopicSerializer, TimeSerializer


# Create your views here.
class TaskList(APIView):
    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TopicList(APIView):
    def get(self, request):
        topics = Topic.objects.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)


class TimeList(APIView):
    def get(self, request):
        times = Time.objects.all()
        serializer = TimeSerializer(times, many=True)
        return Response(serializer.data)
