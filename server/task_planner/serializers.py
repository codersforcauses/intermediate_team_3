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


class TaskSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(read_only=True)
    times = TimeSerializer(read_only=True)

    class Meta:
        model = Task
        fields = (
            "id",
            "name",
            "description",
            "completed",
            "user",
            "topics",
            "times",
        )
