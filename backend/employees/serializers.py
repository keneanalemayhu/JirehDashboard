from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    location_name = serializers.CharField(source='location.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id',
            'location',
            'location_name',
            'full_name',
            'phone',
            'position',
            'email',
            'hire_date',
            'is_active',
            'salary',
            'employment_status',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
