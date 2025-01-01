from rest_framework import permissions
from .models import Store

class IsStoreOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of a store to access it.
    """

    def has_permission(self, request, view):
        # Allow any authenticated user to list stores or create a new store
        if view.action in ['list', 'create']:
            return request.user and request.user.is_authenticated
        return True

    def has_object_permission(self, request, view, obj):
        # Get the store object
        store = None
        if hasattr(obj, 'store'):
            # If the object has a store field (like Location or Employee)
            store = obj.store
        elif isinstance(obj, Store):
            # If the object is a Store
            store = obj
        
        # Check if user is the store owner
        return store and request.user and request.user.is_authenticated and store.owner == request.user
