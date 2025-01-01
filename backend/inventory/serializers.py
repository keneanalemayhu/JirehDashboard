from rest_framework import serializers
from .models import Category, Item, Expense, ExpenseCategory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id', 'location', 'name', 'description', 'is_active', 
            'is_hidden', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            'id', 'category', 'name', 'price', 'barcode', 'quantity',
            'last_inventory_update', 'is_active', 'is_hidden', 'is_temporary',
            'expiry_hours', 'auto_reset_quantity', 'last_quantity_reset',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'category', 'created_at', 'updated_at', 
            'last_inventory_update', 'last_quantity_reset'
        ]

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = [
            'id', 'business', 'name', 'description', 'is_active',
            'is_recurring', 'budget_limit', 'parent_category',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ExpenseSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Expense
        fields = [
            'id', 'business', 'category', 'category_name', 'amount',
            'description', 'receipt_number', 'payment_method',
            'receipt_image_url', 'expense_date', 'is_recurring',
            'recurring_frequency', 'recurring_end_date',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'receipt_number', 'created_at', 'updated_at']
