from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, 
    RegisterView, 
    PasswordResetRequestView,
    PasswordResetConfirmView,
    ChangePasswordView,
    UserAccountStatusView,
    UserProfileUpdateView,
    CustomTokenRefreshView,
    UserRegistrationViewSet
)

router = DefaultRouter()
router.register(r'register-user', UserRegistrationViewSet, basename='register-user')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile_update'),
    path('account/status/', UserAccountStatusView.as_view(), name='account_status'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]