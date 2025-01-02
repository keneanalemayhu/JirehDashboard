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
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from business_settings.models import BusinessProfile
from django.core.validators import validate_email
from phonenumber_field.validators import validate_international_phonenumber
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from django.utils.crypto import get_random_string
from store.models import Location, Store

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
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
        required=True
    )

    def validate(self, attrs):
        identifier = attrs.get('identifier')
        password = attrs.get('password')

        if identifier and password:
            # Try to find user by email or username
            try:
                if '@' in identifier:
                    user = User.objects.get(email=identifier)
                else:
                    user = User.objects.get(user_name=identifier)
                
                if not user.check_password(password):
                    raise serializers.ValidationError({
                        'detail': 'Invalid credentials. Please check your email/username and password.'
                    })
            except User.DoesNotExist:
                raise serializers.ValidationError({
                    'detail': 'No account found with these credentials.'
                })
        else:
            raise serializers.ValidationError({
                'detail': 'Both email/username and password are required.'
            })

        attrs['user'] = user
        return attrs

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value

    def send_reset_email(self, user):
        token = default_token_generator.make_token(user)
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}&email={user.email}"
        
        send_mail(
            'Password Reset Request',
            f'Click the following link to reset your password: {reset_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True,
        style={'input_type': 'password'},
        validators=[validate_password]
    )

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs['email'])
            if not default_token_generator.check_token(user, attrs['token']):
                raise serializers.ValidationError("Invalid token")
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email")
        
        return attrs

    def save(self):
        user = User.objects.get(email=self.validated_data['email'])
        user.set_password(self.validated_data['new_password'])
        user.save()
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
        kwargs.pop('context', None)
        super().__init__(*args, **kwargs)

    def validate(self, attrs):
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError({
                "new_password": "New password must be different from old password."
            })
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone_number', 'business_name']

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = ['business_name', 'business_phone', 'business_address']
        extra_kwargs = {
            'business_name': {'required': True},
            'business_phone': {'required': False},
            'business_address': {'required': False},
        }

class RegisterSerializer(serializers.ModelSerializer):
    business_profile = BusinessProfileSerializer(required=False, allow_null=True)
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'password1', 'password2', 'full_name', 'user_name', 
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
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True, 'validators': [validate_international_phonenumber]},
            'role': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        # Remove password2 from the attributes as we don't need it anymore
        attrs.pop('password2', None)
        
        # Rename password1 to password for user creation
        attrs['password'] = attrs.pop('password1')
        
        return attrs

    def create(self, validated_data):
        business_profile_data = validated_data.pop('business_profile', None)
        password = validated_data.pop('password')
        
        # Create the user first
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=password,
            user_name=validated_data.get('user_name', ''),
            full_name=validated_data.get('name', ''),
            phone_number=validated_data.get('phone_number', ''),
            role='owner',
            is_active=True
        )

        if business_profile_data:
            try:
                # Create the business profile
                business = BusinessProfile.objects.create(
                    owner=user,
                    business_name=business_profile_data.get('business_name', ''),
                    business_phone=business_profile_data.get('business_phone', ''),
                    business_address=business_profile_data.get('business_address', '')
                )

                # Create a store first
                store = Store.objects.create(
                    name=business_profile_data.get('business_name', ''),
                    address=business_profile_data.get('business_address', ''),
                    contact_number=business_profile_data.get('business_phone', ''),
                    registration_number=f"STR-{user.id}-{business.id}",
                    owner=user,
                    admin=user
                )

                # Now create the location with both store and business references
                location = Location.objects.create(
                    store=store,
                    business=business,
                    name="Main Location",
                    address=business_profile_data.get('business_address', ''),
                    contact_number=business_profile_data.get('business_phone', ''),
                    is_active=True
                )

                # Update user with location
                user.location_id = location.id
                user.save()
            except Exception as e:
                # Rollback if anything fails
                if 'store' in locals():
                    store.delete()
                if 'business' in locals():
                    business.delete()
                user.delete()
                raise serializers.ValidationError(f"Failed to create business profile: {str(e)}")

        # Return the user object instead of a dictionary
        return user

class UserRegistrationSerializer(serializers.ModelSerializer):
    location_id = serializers.IntegerField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, required=True)
    phone_number = serializers.CharField(required=True)
    full_name = serializers.CharField(required=True)
    user_name = serializers.CharField(required=True)
    location = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['user_name', 'full_name', 'email', 'phone_number', 'location_id', 'role', 'is_active', 'location']

    def get_location(self, obj):
        # Get the location from related store model
        try:
            # Assuming you're storing location_id somewhere, maybe in a related model or attribute
            location = Location.objects.get(id=obj.location_id)
            return {
                'id': location.id,
                'name': location.name,
                'address': location.address,
                'contact_number': str(location.contact_number)
            }
        except Location.DoesNotExist:
            return None

    def create(self, validated_data):
        location_id = validated_data.pop('location_id')
        try:
            location = Location.objects.get(id=location_id)
            # Store location_id as an attribute of the user
            validated_data['location_id'] = location.id
            validated_data['created_by'] = self.context['request'].user
            validated_data['is_active'] = True
        except Location.DoesNotExist:
            raise serializers.ValidationError({'location_id': 'Invalid location ID'})

        # Generate a random password
        password = get_random_string(length=12)
        user = User.objects.create_user(
            email=validated_data['email'],
            user_name=validated_data['user_name'],
            full_name=validated_data['full_name'],
            phone_number=validated_data['phone_number'],
            role=validated_data['role'],
            is_active=validated_data['is_active'],
            password=password,
            created_by=self.context['request'].user,
            location_id=location.id  # Save location_id with the user
        )

        # Send password to user's email
        send_mail(
            'Your Account Password',
            f'Your password is: {password}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

        return user
    
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'phone_number']
        read_only_fields = ['email']

class AccountUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    new_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    email = serializers.EmailField(read_only=True)  # Read-only since email updates need verification

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'phone_number', 'current_password', 'new_password']

    def update(self, instance, validated_data):
    # Handle password update if both fields are provided
        if validated_data.get('new_password') and validated_data.get('current_password'):
            if not instance.check_password(validated_data['current_password']):
                raise serializers.ValidationError({"current_password": "Incorrect password"})
            instance.set_password(validated_data['new_password'])
            
        # Update other fields
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        
        instance.save()
        return instance
    

class ProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(required=False)
    username = serializers.CharField(source='user_name')

    class Meta:
        model = CustomUser
        fields = ['username', 'avatar']

    def validate_username(self, value):
        if CustomUser.objects.filter(user_name=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Username already taken")
        return value
    def get_avatar(self, obj):
        request = self.context.get('request')
        if obj.avatar:
            return request.build_absolute_uri(obj.avatar.url)
        return None