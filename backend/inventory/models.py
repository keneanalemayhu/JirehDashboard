from django.db import models
from store.models import Location
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
    quantity = models.IntegerField(default=0)
    last_inventory_update = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    is_hidden = models.BooleanField(default=False)
    is_temporary = models.BooleanField(default=False)
    expiry_hours = models.IntegerField(null=True, blank=True)
    auto_reset_quantity = models.BooleanField(default=False)
    last_quantity_reset = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

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