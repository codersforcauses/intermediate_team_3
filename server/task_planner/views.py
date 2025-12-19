from django.shortcuts import render

# from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Task, Topic, Time
from .serializers import TaskReadSerializer, TaskWriteSerializer, TopicSerializer, TimeSerializer


# Create your views here.

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

class TaskViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return TaskReadSerializer
        return TaskWriteSerializer

    def get_queryset(self):
        #return Task.objects.filter(user=self.request.user) # Will restrict tasks to a given user when authentication is added.
        return Task.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)