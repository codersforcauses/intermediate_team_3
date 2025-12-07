from rest_framework import serializers
from .models import Task, Topic, Time


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"


class TopicDetailSerializer(serializers.ModelSerializer):
    # Temporary serializer while trying to figure out issue with color_hex
    class Meta:
        model = Topic
        fields = (
            "id",
            "name",
        )


class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    # 1. This should be TopicSerializer instead but breaks because of
    # color_hex for some reason
    # 2. This method is also not working for showing multiple topics
    topics = TopicDetailSerializer(read_only=True)

    # Should also link the times to the Task here, not sure how to do that yet
    # times = TimeSerializer(read_only=True)

    class Meta:
        model = Task
        fields = (
            "id",
            "name",
            "description",
            "completed",
            "user",
            "topics",
            # "times",
        )
