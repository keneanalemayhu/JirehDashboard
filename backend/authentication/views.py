from django.shortcuts import render
from business_settings.models import BusinessProfile
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .serializers import RegisterSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import PasswordResetRequestSerializer, PasswordResetConfirmSerializer
from django.contrib.auth import authenticate, get_user_model
#import changePasswordView
from .serializers import ChangePasswordSerializer
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserUpdateSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserProfileUpdateSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    BusinessProfileSerializer
)
from django.core.exceptions import ValidationError
User = get_user_model()

def format_error_response(message, errors=None, code=None):
    response = {
        'success': False,
        'message': message,
    }
    if errors:
        response['errors'] = errors
    if code:
        response['code'] = code
    return response

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            response.data['success'] = True
            return response
        except Exception as e:
            return Response(
                format_error_response('Login failed', str(e)),
                status=status.HTTP_401_UNAUTHORIZED
            )

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response(
                format_error_response('Failed to fetch user details', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def patch(self, request, *args, **kwargs):
        try:
            return super().patch(request, *args, **kwargs)
        except Exception as e:
            return Response(
                format_error_response('Failed to update user details', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request, *args, **kwargs):
        try:
            return super().get(request, *args, **kwargs)
        except Exception as e:
            return Response(
                format_error_response('Failed to fetch user list', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            return Response({
                'success': True,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'business_name': user.business_name,
                    'phone_number': str(user.phone_number) if user.phone_number else None
                }
            })
        except Exception as e:
            return Response(
                format_error_response('Failed to fetch user profile', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            print("Login attempt with data:", request.data)
            serializer = LoginSerializer(data=request.data)
            
            if not serializer.is_valid():
                print("Validation errors:", serializer.errors)
                return Response({
                    'success': False,
                    'detail': serializer.errors.get('detail', 'Invalid input'),
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            user = serializer.validated_data['user']
            
            # Get business profile information
            try:
                business_profile = user.business_profile
                business_type = business_profile.business_type if business_profile else None
                role = 'super_admin' if user.is_superuser else user.role
            except BusinessProfile.DoesNotExist:
                business_type = None
                role = 'super_admin' if user.is_superuser else 'user'
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'business_type': business_type,
                'role': role
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print("Login error:", str(e))
            return Response({
                'success': False,
                'detail': 'Login failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                response_data = {
                    'success': True,
                    'message': 'Registration successful',
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    },
                    'user': UserSerializer(user).data
                }
                
                # Add business profile if exists
                try:
                    business_profile = user.business_profile
                    response_data['business_profile'] = BusinessProfileSerializer(business_profile).data
                except BusinessProfile.DoesNotExist:
                    pass
                
                return Response(response_data, status=status.HTTP_201_CREATED)
            
            return Response(
                format_error_response('Registration failed', serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            return Response(
                format_error_response('Validation error', str(e)),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                format_error_response('Registration failed', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({
                'success': True,
                'message': 'Successfully logged out.'
            }, status=status.HTTP_200_OK)
        except Exception:
            return Response(
                format_error_response('Invalid token'),
                status=status.HTTP_400_BAD_REQUEST
            )

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = PasswordResetRequestSerializer(data=request.data)
            if serializer.is_valid():
                user = CustomUser.objects.get(email=serializer.validated_data['email'])
                serializer.send_reset_email(user)
                return Response(
                    {
                        'success': True,
                        'message': 'Password reset email has been sent.'
                    },
                    status=status.HTTP_200_OK
                )
            return Response(
                format_error_response('Password reset failed', serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                format_error_response('Password reset failed', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            serializer = PasswordResetConfirmSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        'success': True,
                        'message': 'Password has been reset successfully.'
                    },
                    status=status.HTTP_200_OK
                )
            return Response(
                format_error_response('Password reset failed', serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                format_error_response('Password reset failed', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            serializer = ChangePasswordSerializer(data=request.data)
            
            if serializer.is_valid():
                # Pass the user explicitly
                serializer.save(user=request.user)
                return Response(
                    {
                        'success': True,
                        'message': 'Password has been changed successfully.'
                    },
                    status=status.HTTP_200_OK
                )
            return Response(
                format_error_response('Password change failed', serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                format_error_response('Password change failed', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserAccountStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        try:
            user_id = request.data.get('user_id')
            action = request.data.get('action')  # 'activate' or 'deactivate'

            user = CustomUser.objects.get(id=user_id)
            
            if action == 'activate':
                user.is_active = True
                message = "User account activated successfully."
            elif action == 'deactivate':
                user.is_active = False
                message = "User account deactivated successfully."
            else:
                return Response(
                    format_error_response('Invalid action', code='invalid_action'),
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user.save()
            return Response({
                'success': True,
                'message': message
            }, status=status.HTTP_200_OK)
        
        except CustomUser.DoesNotExist:
            return Response(
                format_error_response('User not found', code='user_not_found'),
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                format_error_response('Failed to update user status', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            serializer = UserProfileUpdateSerializer(
                request.user, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                user = serializer.save()
                return Response(
                    {
                        'success': True,
                        'message': 'Profile updated successfully',
                        'user': UserSerializer(user).data
                    }, 
                    status=status.HTTP_200_OK
                )
            
            return Response(
                format_error_response('Profile update failed', serializer.errors),
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                format_error_response('Profile update failed', str(e)),
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            
            # Get the user from the refresh token
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                user = User.objects.get(id=token['user_id'])
                
                # Add user data to response
                response.data['user'] = {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_superuser': user.is_superuser,
                }
            
            response.data['success'] = True
            return response
            
        except Exception as e:
            return Response(
                format_error_response('Invalid token or token has expired', str(e)),
                status=status.HTTP_401_UNAUTHORIZED
            )