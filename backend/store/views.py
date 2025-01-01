from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from .models import Store, Location
from .serializers import LocationSerializer, StoreSerializer
import logging

logger = logging.getLogger(__name__)

class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [AllowAny]  # Temporarily remove authentication
    queryset = Store.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Received store creation request with data: {request.data}")
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Validation errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            store = serializer.save()
            return Response({
                'success': True,
                'data': self.get_serializer(store).data,
                'message': f'Store created successfully with ID: {store.id}'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Error creating store: {str(e)}")
            return Response({
                'success': False,
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

class LocationViewSet(viewsets.ModelViewSet):
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]  # Temporarily remove authentication

    def get_queryset(self):
        store_id = self.kwargs['store_pk']
        return Location.objects.filter(store_id=store_id)

    def create(self, request, *args, **kwargs):
        try:
            logger.info(f"Received location creation request with data: {request.data}")
            # Check if store exists first
            store_id = self.kwargs['store_pk']
            try:
                store = Store.objects.get(id=store_id)
            except Store.DoesNotExist:
                return Response({
                    'success': False,
                    'errors': {'store': 'Store does not exist'}
                }, status=status.HTTP_404_NOT_FOUND)
                
            serializer = self.get_serializer(data=request.data, context={'store': store})
            if not serializer.is_valid():
                logger.error(f"Validation errors: {serializer.errors}")
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            location = serializer.save()
            return Response({
                'success': True,
                'data': self.get_serializer(location).data,
                'message': f'Location created successfully for store {store_id}'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({
                'success': False,
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            
            store_id = self.kwargs['store_pk']
            store = Store.objects.get(id=store_id)
            
            serializer = self.get_serializer(
                instance, 
                data=request.data, 
                partial=partial,
                context={'store': store}
            )
            
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
            location = serializer.save()
            return Response({
                'success': True,
                'data': self.get_serializer(location).data,
                'message': 'Location updated successfully'
            })
            
        except Store.DoesNotExist:
            return Response({
                'success': False,
                'errors': {'store': 'Store does not exist'}
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({
                'success': True,
                'message': 'Location deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                'success': False,
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
