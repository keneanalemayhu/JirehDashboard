from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id', 'store', 'location', 'full_name', 'position', 'phone',
            'email', 'hire_date', 'is_active', 'salary', 'employment_status',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
