from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()

class IsUserOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, User):
            # If this is for the user object check against logged in user
            return obj == request.user
        # Otherwise check user field against logged in user
        return obj.user == request.user