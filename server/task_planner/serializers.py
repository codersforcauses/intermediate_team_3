from rest_framework import serializers
from django.db import transaction
from .models import Task, Topic, Time


class TopicReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = "__all__"


class TimeReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = "__all__"


class TaskReadSerializer(serializers.ModelSerializer):
    topics = TopicReadSerializer(many=True, read_only=True)
    times = TimeReadSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = "__all__"

class TopicWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ["name", "color_hex"]

class TimeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = ["day", "start_time", "end_time", "repeating"]

class TaskWriteSerializer(serializers.ModelSerializer):
    existing_topic_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Topic.objects.all(), write_only=True, required=False
    )
    new_topics = TopicWriteSerializer(many=True, write_only=True, required=False)
    times = TimeWriteSerializer(many=True,  required=False)

    class Meta:
        model = Task
        fields = ["name", "description", "completed", "existing_topic_ids", "new_topics", "times"]

    @transaction.atomic
    def create(self, validated_data):
        user_id = validated_data.pop("user_id", None)
        existing_topics = validated_data.pop("existing_topic_ids", [])
        new_topics_data = validated_data.pop("new_topics", [])
        times_data = validated_data.pop("times", [])

        task = Task.objects.create(**validated_data, user_id=user_id)

        for topic in existing_topics:
            task.topics.add(topic)

        for topic_data in new_topics_data:
            topic = Topic.objects.create(**topic_data, user_id=user_id)
            task.topics.add(topic)

        Time.objects.bulk_create([
            Time(task=task, **time_data)
            for time_data in times_data
        ])

        task.save()
        task.refresh_from_db()
        return Task.objects.get(id=task.id)

class TaskCompleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["completed"]