from django.shortcuts import render

# from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
#from rest_framework.permissions import IsAuthenticated

from .models import Task, Topic, Time
from .serializers import TaskReadSerializer, TaskWriteSerializer, TopicReadSerializer, TimeReadSerializer


# Create your views here.

class TopicList(APIView):
    def get(self, request):
        topics = Topic.objects.all()
        serializer = TopicReadSerializer(topics, many=True)
        return Response(serializer.data)


class TimeList(APIView):
    def get(self, request):
        times = Time.objects.all()
        serializer = TimeReadSerializer(times, many=True)
        return Response(serializer.data)

class TaskViewSet(ModelViewSet):

    #permission_classes = [IsAuthenticated]  # Uncomment when authentication is added.

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return TaskReadSerializer
        return TaskWriteSerializer

    def get_queryset(self):
        # -- Temporary Code --
        user_id = self.request.query_params.get('user_id')
        if user_id:
            return Task.objects.filter(user_id=user_id)
        # -- End Temporary Code --
        
        #return Task.objects.filter(user=self.request.user) # Will restrict tasks to a given user when authentication is added.
        return Task.objects.all()
    
    def perform_create(self, serializer):
        # Use explicit user_id when provided (no auth yet); otherwise require auth
        user_id = self.request.data.get("user_id")
        if user_id:
            serializer.save(user_id=user_id)
            return
        if self.request.user and self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
            return
        raise ValidationError({"user_id": "Provide user_id or authenticate."})