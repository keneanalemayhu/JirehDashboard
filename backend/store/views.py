from django.shortcuts import render
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Location
from .serializers import LocationSerializer

# Create your views here.

class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'address', 'contact_number']
    ordering_fields = ['name', 'created_at', 'is_active']
    filterset_fields = ['is_active']

    def get_queryset(self):
        """
        This view should return a list of all locations
        for the currently authenticated user's business.
        """
        user = self.request.user
        if hasattr(user, 'businesses'):
            business = user.businesses.first()
            if business:
                return Location.objects.filter(business=business)
        return Location.objects.none()

    def perform_create(self, serializer):
        """
        Associate the location with the user's business when creating
        """
        user = self.request.user
        if hasattr(user, 'businesses'):
            business = user.businesses.first()
            if business:
                serializer.save(business=business)
            else:
                serializer.save()
        else:
            serializer.save()

    def list(self, request, *args, **kwargs):
        """
        Override list method to include total count in response
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
