from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, 
    RegisterView, 
    UserProfileView, 
    LogoutView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    ChangePasswordView,
    UserAccountStatusView,
    UserProfileUpdateView,
    CustomTokenRefreshView

)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='profile_update'),
    path('account/status/', UserAccountStatusView.as_view(), name='account_status'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]