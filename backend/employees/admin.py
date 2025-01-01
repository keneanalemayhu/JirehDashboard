from django.contrib import admin
from .models import Employee

# Register your models here.
@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'store', 'location', 'position', 'phone', 'email', 'is_active')
    list_filter = ('store', 'location', 'is_active', 'employment_status')
    search_fields = ('full_name', 'email', 'phone')
    ordering = ('store', 'full_name')
