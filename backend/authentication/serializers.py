from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from phonenumber_field.validators import validate_international_phonenumber
from .utils import generate_username  # Make sure to create this utility function
from .models import CustomUser
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
#import api view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from business_settings.models import BusinessProfile
from django.core.validators import validate_email
from phonenumber_field.validators import validate_international_phonenumber
from django.core.exceptions import ValidationError
#import is authenticated
from rest_framework.permissions import IsAuthenticated
User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['user_name'] = user.user_name
        return token



class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'user_name', 'phone_number', 'role']

    def get_full_name(self, obj):
        return obj.full_name

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'user_name', 'phone_number', 'business_name']
        
    def update(self, instance, validated_data):
        # Only update fields that are provided
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)  
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
        required=True
    )

    def validate(self, attrs):
        identifier = attrs.get('email', '').lower()  
        password = attrs.get('password')

        if not identifier or not password:
            raise serializers.ValidationError({
                'detail': 'Both email/username and password are required.'
            })

        # Try to find user by email or username
        user = CustomUser.objects.filter(email__iexact=identifier).first()
        if not user:
            user = CustomUser.objects.filter(user_name__iexact=identifier).first()
        
        if not user:
            raise serializers.ValidationError({
                'detail': 'No account found with this email or username.'
            })
            
        if not user.check_password(password):
            raise serializers.ValidationError({
                'detail': 'Invalid password.'
            })

        attrs['user'] = user
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        user = CustomUser.objects.filter(email=value).first()
        if not user:
            raise serializers.ValidationError("No user found with this email address.")
        return value

    def send_reset_email(self, user):
        try:
            # Generate a password reset token
            token = default_token_generator.make_token(user)
            
            # Construct reset URL
            reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={token}&email={user.email}"
            
            # Email content
            subject = 'Password Reset Request'
            message = f'''
            Hello,
            
            You have requested to reset your password. Please click the link below to reset your password:
            
            {reset_url}
            
            If you did not request this password reset, please ignore this email.
            
            This link will expire in 24 hours.
            '''
            
            # Send email with detailed error handling
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
                print(f"Password reset email sent successfully to {user.email}")
            except Exception as e:
                print(f"Error sending password reset email: {str(e)}")
                raise serializers.ValidationError(f"Failed to send password reset email: {str(e)}")
                
        except Exception as e:
            print(f"Error in send_reset_email: {str(e)}")
            raise serializers.ValidationError(f"Password reset process failed: {str(e)}")


class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )

    def validate(self, attrs):
        print("Validating password reset data:", attrs)  # Debug log
        
        # Validate email and token
        user = CustomUser.objects.filter(email=attrs['email']).first()
        if not user:
            raise serializers.ValidationError({"email": "Invalid email address"})

        print("Found user:", user.email)  # Debug log

        # Check if token is valid
        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({"token": "Invalid or expired password reset token"})

        print("Token is valid")  # Debug log
        return attrs

    def save(self):
        print("Saving new password")  # Debug log
        user = CustomUser.objects.get(email=self.validated_data['email'])
        user.set_password(self.validated_data['new_password'])
        user.save()
        print("Password updated successfully")  # Debug log
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        trim_whitespace=False
    )
    new_password = serializers.CharField(
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def __init__(self, *args, **kwargs):
        # Remove context from initialization
        kwargs.pop('context', None)
        super().__init__(*args, **kwargs)

    def validate(self, attrs):
        # Additional validation to ensure new password is different
        if attrs.get('old_password') == attrs.get('new_password'):
            raise serializers.ValidationError({
                "new_password": "New password must be different from the old password."
            })
        return attrs

    def validate_old_password(self, value):
        # Remove context-based validation
        return value

    def save(self, **kwargs):
        # Get the user from kwargs
        user = kwargs.get('user')
        if not user:
            raise serializers.ValidationError("User is required to change password.")
        
        # Verify old password
        if not user.check_password(self.validated_data['old_password']):
            raise serializers.ValidationError({
                "old_password": "Incorrect old password"
            })
        
        # Set and save new password
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user





class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone_number', 'business_name']
        
    def update(self, instance, validated_data):
        # Only update fields that are provided
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance



class BusinessProfileSerializer(serializers.ModelSerializer):
    BUSINESS_TYPES = [
        ('retail', 'Retail'),
        ('wholesale', 'Wholesale'),
        ('service', 'Service'),
    ]

    class Meta:
        model = BusinessProfile
        fields = ['business_name', 'business_type', 'business_phone', 'business_address']
        extra_kwargs = {
            'business_name': {'required': True},
            'business_type': {'required': True},
            'business_phone': {'required': False},
            'business_address': {'required': False},
        }

    def validate_business_type(self, value):
        if value not in [choice[0] for choice in self.BUSINESS_TYPES]:
            raise serializers.ValidationError(
                f"Invalid business type. Choose from {', '.join([choice[0] for choice in self.BUSINESS_TYPES])}"
            )
        return value

class RegisterSerializer(serializers.ModelSerializer):
    business_profile = BusinessProfileSerializer(required=False, allow_null=True)
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(write_only=True, required=False)  # Add this field to handle frontend's name field

    class Meta:
        model = CustomUser
        fields = ['email', 'password1', 'password2', 'name', 'full_name', 'user_name', 
                  'phone_number', 'business_profile', 'role']
        extra_kwargs = {
            'email': {
                'required': True,
                'validators': [validate_email],
                'error_messages': {
                    'unique': 'A user with this email already exists.',
                    'required': 'Email is required.',
                    'blank': 'Email cannot be blank.',
                }
            },
            'full_name': {'required': False},
            'user_name': {'required': False},
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True},
            'role': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        
        # Set full_name from name if provided
        if 'name' in attrs:
            attrs['full_name'] = attrs.pop('name')
            
        # Clean up phone numbers
        if 'phone_number' in attrs and attrs['phone_number']:
            try:
                phone = attrs['phone_number']
                # Remove any non-digit characters
                phone = ''.join(c for c in phone if c.isdigit())
                
                # Handle Ethiopian numbers
                if len(phone) == 9:  # Format: 911234567
                    phone = '+251' + phone
                elif len(phone) == 10 and phone.startswith('0'):  # Format: 0911234567
                    phone = '+251' + phone[1:]
                elif not phone.startswith('+'):
                    phone = '+' + phone
                    
                attrs['phone_number'] = phone
            except Exception as e:
                print(f"Error formatting phone number: {str(e)}")
                
        # Clean up business profile phone
        if 'business_profile' in attrs and attrs['business_profile']:
            business_data = attrs['business_profile']
            if 'business_phone' in business_data and business_data['business_phone']:
                try:
                    phone = business_data['business_phone']
                    # Remove any non-digit characters
                    phone = ''.join(c for c in phone if c.isdigit())
                    
                    # Handle Ethiopian numbers
                    if len(phone) == 9:  # Format: 911234567
                        phone = '+251' + phone
                    elif len(phone) == 10 and phone.startswith('0'):  # Format: 0911234567
                        phone = '+251' + phone[1:]
                    elif not phone.startswith('+'):
                        phone = '+' + phone
                        
                    business_data['business_phone'] = phone
                except Exception as e:
                    print(f"Error formatting business phone: {str(e)}")
                    
        return attrs

    def create(self, validated_data):
        business_profile_data = validated_data.pop('business_profile', None)
        validated_data.pop('password2', None)
        password = validated_data.pop('password1')
        
        # Set default role to owner
        role = validated_data.pop('role', 'owner')
        
        # Create user
        user = CustomUser.objects.create_user(
            **validated_data,
            password=password,
            role=role
        )
        
        # Create business profile if data provided
        if business_profile_data:
            # Remove None or empty string values
            business_profile_data = {
                k: v for k, v in business_profile_data.items() 
                if v is not None and v != ''
            }
            if business_profile_data:
                BusinessProfile.objects.create(
                    user=user,
                    **business_profile_data
                )
        
        return user
