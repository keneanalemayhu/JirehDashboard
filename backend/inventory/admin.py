from django.contrib import admin
from .models import Category, Item

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'is_active', 'is_hidden', 'created_at')
    list_filter = ('location', 'is_active', 'is_hidden')
    search_fields = ('name', 'description')
    ordering = ('location', 'name')

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'quantity', 'is_active', 'is_hidden')
    list_filter = ('category', 'is_active', 'is_hidden')
    search_fields = ('name', 'barcode')
    ordering = ('category', 'name')
