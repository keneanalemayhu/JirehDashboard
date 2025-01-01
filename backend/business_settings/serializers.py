from rest_framework import serializers
from .models import BusinessProfile

class BusinessProfileSerializer(serializers.ModelSerializer):
    owner_id = serializers.IntegerField(read_only=True, source='owner.id')
    owner_email = serializers.EmailField(read_only=True, source='owner.email')

    class Meta:
        model = BusinessProfile
        fields = [
            'id', 
            'owner_id',
            'owner_email',
            'business_name',
            'business_phone',
            'business_address',
            'registration_number',
            'is_active',
            'tax_id',
            'website',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'owner_id', 'owner_email', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Add custom validation here
        """
        return data
