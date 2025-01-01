from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Category, Item, ExpenseCategory, Expense
from .serializers import CategorySerializer, ItemSerializer, ExpenseCategorySerializer, ExpenseSerializer
from store.models import Location
from business_settings.models import BusinessProfile
from rest_framework import serializers

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        location_id = self.kwargs.get('location_pk')
        return Category.objects.filter(location_id=location_id)

    def perform_create(self, serializer):
        location_id = self.kwargs.get('location_pk')
        location = Location.objects.get(id=location_id)
        serializer.save(location=location)

    def create(self, request, *args, **kwargs):
        try:
            print("Received category data:", request.data)
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response({
                    'success': False,
                    'message': 'Validation error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            self.perform_create(serializer)
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Category created successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error creating category:", str(e))
            return Response({
                'success': False,
                'message': str(e),
                'errors': serializer.errors if 'serializer' in locals() else None
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Category updated successfully'
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Category deleted successfully'
        }, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Categories retrieved successfully'
        })

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer

    def get_queryset(self):
        category_id = self.kwargs.get('category_pk')
        return Item.objects.filter(category_id=category_id)

    def create(self, request, *args, **kwargs):
        try:
            print("Received item data:", request.data)
            category_id = self.kwargs.get('category_pk')
            
            try:
                category = Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Category does not exist',
                    'errors': {'category': ['Category does not exist']}
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response({
                    'success': False,
                    'message': 'Validation error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer.save(category=category)
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Item created successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error creating item:", str(e))
            return Response({
                'success': False,
                'message': str(e),
                'errors': serializer.errors if 'serializer' in locals() else None
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Item updated successfully'
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Item deleted successfully'
        }, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Items retrieved successfully'
        })

class ExpenseCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseCategorySerializer

    def get_queryset(self):
        business_id = self.kwargs.get('business_pk')
        return ExpenseCategory.objects.filter(business_id=business_id)

    def perform_create(self, serializer):
        business_id = self.kwargs.get('business_pk')
        business = BusinessProfile.objects.get(id=business_id)
        serializer.save(business=business)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'message': 'Validation error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            self.perform_create(serializer)
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Expense category created successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        business_id = self.kwargs.get('business_pk')
        return Expense.objects.filter(business_id=business_id)

    def perform_create(self, serializer):
        business_id = self.kwargs.get('business_pk')
        business = BusinessProfile.objects.get(id=business_id)
        serializer.save(business=business)

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'message': 'Validation error',
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            self.perform_create(serializer)
            return Response({
                'success': True,
                'data': serializer.data,
                'message': 'Expense created successfully'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Expense updated successfully'
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Expense deleted successfully'
        }, status=status.HTTP_200_OK)
