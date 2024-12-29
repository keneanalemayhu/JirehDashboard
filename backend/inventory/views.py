from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.db.models import Count
from .models import Category, Item, Expense, ExpenseCategory
from .serializers import (CategorySerializer, ItemSerializer, 
                        ExpenseSerializer, ExpenseCategorySerializer)
from store.models import Location
from rest_framework import serializers

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        location_id = self.request.query_params.get('location_id')
        queryset = Category.objects.all()
        
        if location_id:
            queryset = queryset.filter(location_id=location_id)
        
        # Annotate with item count
        queryset = queryset.annotate(item_count=Count('item'))
        
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                self.perform_create(serializer)
                return Response({
                    'success': True,
                    'message': 'Category created successfully',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response({
                'success': False,
                'message': 'Failed to create category',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                return Response({
                    'success': True,
                    'message': 'Category updated successfully',
                    'data': serializer.data
                })
            return Response({
                'success': False,
                'message': 'Failed to update category',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response({
                'success': True,
                'message': 'Category deleted successfully'
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def by_location(self, request):
        """Get categories grouped by location"""
        try:
            location_id = request.query_params.get('location_id')
            if not location_id:
                return Response({
                    'success': False,
                    'message': 'Location ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            categories = self.get_queryset().filter(location_id=location_id)
            serializer = self.get_serializer(categories, many=True)
            
            return Response({
                'success': True,
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        location_id = self.request.query_params.get('location_id')
        category_id = self.request.query_params.get('category_id')
        queryset = Item.objects.all()
        
        if location_id:
            queryset = queryset.filter(category__location_id=location_id)
        
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_items = Item.objects.count()
        active_items = Item.objects.filter(is_active=True).count()
        hidden_items = Item.objects.filter(is_hidden=True).count()
        categories_with_items = Item.objects.values('category').annotate(item_count=Count('id')).count()

        return Response({
            'total_items': total_items,
            'active_items': active_items,
            'hidden_items': hidden_items,
            'categories_with_items': categories_with_items,
        })

class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'businesses'):
            print(f"User {user.email} has no businesses attribute")
            return ExpenseCategory.objects.none()
        
        business = user.businesses.first()
        if not business:
            print(f"User {user.email} has no associated business")
            return ExpenseCategory.objects.none()
            
        queryset = ExpenseCategory.objects.filter(business=business)
        print(f"Found {queryset.count()} expense categories for business {business.business_name}")
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, 'businesses'):
            raise serializers.ValidationError("User has no associated businesses")
            
        business = user.businesses.first()
        if not business:
            raise serializers.ValidationError("User has no active business")
            
        serializer.save(business=business)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'businesses'):
            business = user.businesses.first()
            if business:
                return Expense.objects.filter(business=business)
        return Expense.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'businesses'):
            business = user.businesses.first()
            if business:
                serializer.save(business=business)
