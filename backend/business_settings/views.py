from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import BusinessProfile
from .serializers import BusinessProfileSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

class BusinessProfileViewSet(viewsets.ModelViewSet):
    serializer_class = BusinessProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all stores
        for the currently authenticated user.
        """
        user = self.request.user
        if user.is_superuser:
            return BusinessProfile.objects.all()
        elif user.role == 'owner':
            return BusinessProfile.objects.filter(owner=user)
        else:
            return BusinessProfile.objects.none()

    def perform_create(self, serializer):
        """
        Set the owner to the current authenticated user when creating a store
        """
        with transaction.atomic():
            # Check if user already has a store
            if self.request.user.role != 'owner':
                raise permissions.PermissionDenied("Only owners can create stores")
            
            if BusinessProfile.objects.filter(owner=self.request.user).exists():
                raise permissions.PermissionDenied("User already has a store")
            
            # Set the owner to the current user
            serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """
        Ensure users can only update their own store
        """
        store = self.get_object()
        if store.owner != self.request.user and not self.request.user.is_superuser:
            raise permissions.PermissionDenied("You don't have permission to update this store")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Ensure users can only delete their own store
        """
        if instance.owner != self.request.user and not self.request.user.is_superuser:
            raise permissions.PermissionDenied("You don't have permission to delete this store")
        instance.delete()
