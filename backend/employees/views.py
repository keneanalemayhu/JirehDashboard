from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
from store.models import Store

class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    
    def get_queryset(self):
        store_id = self.kwargs.get('store_pk')
        return Employee.objects.filter(store_id=store_id)

    def perform_create(self, serializer):
        store_id = self.kwargs.get('store_pk')
        store = Store.objects.get(id=store_id)
        serializer.save(store=store)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Employee created successfully'
        }, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Employee updated successfully'
        })

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({
            'success': True,
            'message': 'Employee deleted successfully'
        }, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Employees retrieved successfully'
        })
