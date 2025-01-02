from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer
from store.models import Store, Location


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        location_id = self.kwargs['location_id']
        return Order.objects.filter(
            location_id=location_id
        ).select_related('location', 'employee')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        print("[OrderViewSet.create] Request data:", request.data)
        print("[OrderViewSet.create] User:", request.user)
        print("[OrderViewSet.create] Auth:", request.auth)
        print("[OrderViewSet.create] Headers:", request.headers)
        
        serializer = self.get_serializer(data=request.data)
        try:
            if not serializer.is_valid():
                print("[OrderViewSet.create] Validation errors:", serializer.errors)
                return Response({
                    'success': False,
                    'error': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
                
            location_id = self.kwargs.get('location_id')
            print("[OrderViewSet.create] Location ID:", location_id)
            print("[OrderViewSet.create] Validated data:", serializer.validated_data)
            
            # Get location and its associated store
            try:
                location = Location.objects.get(id=location_id)
                store = location.store
            except Location.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Location not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Check if user has permission for this store
            if not (store.owner == request.user or store.admin == request.user):
                return Response({
                    'success': False,
                    'error': 'You do not have permission for this store'
                }, status=status.HTTP_403_FORBIDDEN)
            
            order = serializer.save(
                location_id=location_id,
                user=request.user,
                store=store,
                status='pending',
                payment_status='pending'
            )
            print("[OrderViewSet.create] Order created successfully:", order.id)
            
            response_serializer = OrderSerializer(order)
            return Response({
                'success': True,
                'data': response_serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("[OrderViewSet.create] Error:", str(e))
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            print("[OrderViewSet.retrieve] Error:", str(e))
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        return Response({
            'success': True,
            'data': serializer.data
        })