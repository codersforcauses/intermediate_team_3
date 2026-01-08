from django.shortcuts import render

# from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

from .models import Task, Topic, Time
from .serializers import TaskReadSerializer, TaskWriteSerializer, TopicReadSerializer, TimeReadSerializer, TaskCompleteSerializer

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password or not username:
            return Response(
                {"error": "Missing fields required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username,email=email, password=password)
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        return Response({
            "user_id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
        })

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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return TaskReadSerializer
        return TaskWriteSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user) # Will restrict tasks to a given user when authentication is added.
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
    
    def create(self, request, *args, **kwargs):
        write_serializer = TaskWriteSerializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)

        user_id = request.data.get("user_id")
        if user_id:
            task = write_serializer.save(user_id=user_id)
        elif request.user and request.user.is_authenticated:
            task = write_serializer.save(user=request.user)
        else:
            raise ValidationError({"user_id": "Provide user_id or authenticate."})

        read_serializer = TaskReadSerializer(task)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['patch'])
    def toggle_complete(self, request, pk=None):
        task = self.get_object()
        serializer = TaskCompleteSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        read_serializer = TaskReadSerializer(task)
        return Response(read_serializer.data)