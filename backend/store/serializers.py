from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'business', 'name', 'address', 'contact_number', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_contact_number(self, value):
        # Add phone number validation if needed
        return value

    def create(self, validated_data):
        # Get the business from the context if not provided
        if 'business' not in validated_data and 'request' in self.context:
            user = self.context['request'].user
            if hasattr(user, 'businesses'):
                validated_data['business'] = user.businesses.first()
        return super().create(validated_data)
