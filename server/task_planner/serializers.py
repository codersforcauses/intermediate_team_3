from rest_framework import serializers
from .models import Task, Topic, Time


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"


class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = "__all__"


class TaskReadSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    times = TimeSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = "__all__"

class TaskWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["name", "description", "completed"]