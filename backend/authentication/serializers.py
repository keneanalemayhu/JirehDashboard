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
from .models import BusinessProfile
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
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'phone_number']

    def get_full_name(self, obj):
        return obj.full_name

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'user_name', 'phone')
        read_only_fields = ('email',)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True,
        required=True
    )

    def validate(self, attrs):
        email = attrs.get('email', '').lower()
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError({
                'detail': 'Both email and password are required.'
            })

        # Find user by case-insensitive email
        user = CustomUser.objects.filter(email__iexact=email).first()
        
        if not user:
            raise serializers.ValidationError({
                'detail': 'No account found with this email.'
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
        # Generate a password reset token
        token = default_token_generator.make_token(user)
        
        # Construct reset URL (adjust as needed for your frontend)
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}&email={user.email}"
        
        # Send email
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
        # Validate email and token
        user = CustomUser.objects.filter(email=attrs['email']).first()
        if not user:
            raise serializers.ValidationError("Invalid email")

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError("Invalid or expired token")

        return attrs

    def save(self):
        user = CustomUser.objects.get(email=self.validated_data['email'])
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



# class ChangePasswordView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = ChangePasswordSerializer(
#             data=request.data, 
#             context={'request': request}
#         )
        
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {"detail": "Password changed successfully"},
#                 status=status.HTTP_200_OK
#             )
        
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




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

    class Meta:
        model = CustomUser
        fields = ['email', 'password1', 'password2', 'first_name', 'last_name', 
                 'phone_number', 'business_profile', 'role']
        extra_kwargs = {
            'email': {
                'required': True,
                'validators': [],
                'error_messages': {
                    'unique': 'A user with this email already exists.',
                    'required': 'Email is required.',
                    'blank': 'Email cannot be blank.',
                }
            },
            'first_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'last_name': {'required': False, 'allow_blank': True, 'allow_null': True},
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True},
            'role': {'required': False, 'default': 'owner'}  # Default role for business registration
        }

    def create(self, validated_data):
        try:
            business_profile_data = validated_data.pop('business_profile', None)
            validated_data.pop('password2', None)
            password = validated_data.pop('password1')
            
            # Set default role for business registration
            if business_profile_data and 'role' not in validated_data:
                validated_data['role'] = 'owner'
            
            user = CustomUser.objects.create_user(
                **validated_data, 
                password=password
            )
            
            if business_profile_data:
                BusinessProfile.objects.create(
                    user=user, 
                    **business_profile_data
                )
            
            return user
        except Exception as e:
            raise serializers.ValidationError(str(e))