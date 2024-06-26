from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return ((request.user.username == obj.username) and (request.user.email == obj.email))
