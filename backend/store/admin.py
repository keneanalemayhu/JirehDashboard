from django.contrib import admin

from .models import Location, Store

@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'contact_number', 'registration_number', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'address', 'registration_number')

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'store', 'name', 'address', 'contact_number', 'is_active')
    list_filter = ('store', 'is_active')
    search_fields = ('name', 'address')

# Register your models here.
