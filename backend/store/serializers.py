from rest_framework import serializers
from .models import Store, Location
from phonenumber_field.serializerfields import PhoneNumberField
import logging
import phonenumbers

logger = logging.getLogger(__name__)

class StoreSerializer(serializers.ModelSerializer):
    contact_number = PhoneNumberField(required=True)
    
    class Meta:
        model = Store
        fields = ['id', 'name', 'address', 'contact_number', 'registration_number', 'is_active', 'owner', 'admin', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_contact_number(self, value):
        logger.info(f"Validating store contact number: {value}")
        if not value:
            raise serializers.ValidationError("Contact number is required")
        return value

    def create(self, validated_data):
        logger.info(f"Creating store with data: {validated_data}")
        try:
            store = Store.objects.create(**validated_data)
            return store
        except Exception as e:
            logger.error(f"Error creating store: {str(e)}")
            raise serializers.ValidationError(str(e))

class LocationSerializer(serializers.ModelSerializer):
    contact_number = serializers.CharField(required=True)  
    store = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Location
        fields = ['id', 'store', 'name', 'address', 'contact_number', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'store', 'created_at', 'updated_at']

    def validate_contact_number(self, value):
        logger.info(f"Validating location contact number: {value}")
        if not value:
            raise serializers.ValidationError("Contact number is required")
        
        # Remove any dashes or spaces
        cleaned_number = value.replace('-', '').replace(' ', '')
        
        try:
            # Parse and format the number
            phone_number = phonenumbers.parse(cleaned_number, "ET")  # ET for Ethiopia
            if not phonenumbers.is_valid_number(phone_number):
                raise serializers.ValidationError("Enter a valid phone number.")
            
            # Format to E.164 format (e.g., +251912345678)
            formatted_number = phonenumbers.format_number(phone_number, phonenumbers.PhoneNumberFormat.E164)
            return formatted_number
            
        except phonenumbers.NumberParseException:
            raise serializers.ValidationError("Enter a valid phone number.")

    def create(self, validated_data):
        store = self.context.get('store')
        if not store:
            raise serializers.ValidationError("Store is required")
            
        logger.info(f"Creating location for store {store} with data: {validated_data}")
        try:
            location = Location.objects.create(store=store, **validated_data)
            return location
        except Exception as e:
            logger.error(f"Error creating location: {str(e)}")
            raise serializers.ValidationError(str(e))
