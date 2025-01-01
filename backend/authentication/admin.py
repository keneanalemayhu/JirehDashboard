from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'full_name', 'role', 'is_active', 'is_staff', 'location_id', 'avatar')
    search_fields = ('email', 'full_name', 'role', 'location')
    ordering = ('email',)
    readonly_fields = ('created_at', 'updated_at', 'last_login')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'user_name', 'phone_number', 'role', 'location_id', 'avatar')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'created_at', 'updated_at')}),
        
        
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'user_name', 'phone_number', 'password1', 'password2', 'role','avatar',  'is_active', 'is_staff')}
        ),
    )

admin.site.register(CustomUser, CustomUserAdmin)