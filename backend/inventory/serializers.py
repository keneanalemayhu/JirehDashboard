from rest_framework import serializers
from .models import Category, Item, Expense, ExpenseCategory

class CategorySerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'is_active', 'is_hidden', 
                 'created_at', 'updated_at', 'location', 'item_count']
        read_only_fields = ['created_at', 'updated_at']

    def get_item_count(self, obj):
        return obj.item_set.count()

class ItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'category', 'category_name', 'name', 'price', 'barcode',
                 'unit_of_measure', 'quantity', 'reorder_point', 'is_active',
                 'is_hidden', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ExpenseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseCategory
        fields = ['id', 'business', 'name', 'description', 'is_active', 
                 'is_recurring', 'budget_limit', 'parent_category', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

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
        read_only_fields = ['created_at', 'updated_at', 'receipt_number', 'business']

    def validate_expense_date(self, value):
        if not value:
            from django.utils import timezone
            return timezone.now().date()
        return value
