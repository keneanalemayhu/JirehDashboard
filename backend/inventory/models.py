from django.db import models
from store.models import Location
from warehouse.models import Warehouse, WarehouseZone
from business_settings.models import BusinessProfile
from django.utils import timezone

class Category(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_hidden = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Item(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    barcode = models.CharField(max_length=50, unique=True, blank=True, null=True)
    unit_of_measure = models.CharField(max_length=20, choices=[
        ('unit', 'Unit'),
        ('kg', 'Kilogram'),
        ('g', 'Gram'),
        ('l', 'Liter'),
        ('ml', 'Milliliter'),
    ], default='unit')
    quantity = models.IntegerField(default=0)
    reorder_point = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_hidden = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class InventoryStock(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='stock_records')
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='inventory_items')
    zone = models.ForeignKey(WarehouseZone, on_delete=models.CASCADE, related_name='stored_items')
    quantity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('item', 'warehouse', 'zone')

    def __str__(self):
        return f"{self.item.name} - {self.warehouse.name} ({self.quantity})"

class InventoryTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('receive', 'Receive'),
        ('transfer', 'Transfer'),
        ('adjust', 'Adjustment'),
        ('sale', 'Sale'),
        ('return', 'Return'),
        ('damage', 'Damage'),
    ]

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='transactions')
    source_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='outgoing_transactions')
    source_zone = models.ForeignKey(WarehouseZone, on_delete=models.CASCADE, related_name='outgoing_transactions')
    destination_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='incoming_transactions', null=True, blank=True)
    destination_zone = models.ForeignKey(WarehouseZone, on_delete=models.CASCADE, related_name='incoming_transactions', null=True, blank=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    reference_number = models.CharField(max_length=50, unique=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.item.name} ({self.quantity})"

class ExpenseCategory(models.Model):
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_recurring = models.BooleanField(default=False)
    budget_limit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    parent_category = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Expense Categories"

class Expense(models.Model):
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    receipt_number = models.CharField(max_length=20, unique=True, editable=False, blank=True, null=True)
    payment_method = models.CharField(max_length=50, default='Cash')
    receipt_image_url = models.URLField(blank=True, null=True)
    expense_date = models.DateField(default=timezone.now)
    is_recurring = models.BooleanField(default=False)
    recurring_frequency = models.CharField(max_length=20, null=True, blank=True)
    recurring_end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Expenses"

    def __str__(self):
        return f"{self.category.name} - {self.amount}"

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            # Get the last receipt number
            last_expense = Expense.objects.filter(business=self.business).order_by('-receipt_number').first()
            
            if last_expense and last_expense.receipt_number:
                # Extract the number part and increment
                try:
                    last_number = int(last_expense.receipt_number.split('-')[1])
                    next_number = last_number + 1
                except (IndexError, ValueError):
                    next_number = 1
            else:
                next_number = 1
            
            # Format: EXP-YYYYMMDD-XXXX
            date_part = timezone.now().strftime('%Y%m%d')
            self.receipt_number = f'EXP-{date_part}-{next_number:04d}'
        
        super().save(*args, **kwargs)

class ExpenseRecurring(models.Model):
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE)
    category = models.ForeignKey(ExpenseCategory, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.category.name} - {self.amount}"

    class Meta:
        verbose_name_plural = "Recurring Expenses"
