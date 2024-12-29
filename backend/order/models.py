from django.db import models
from store.models import Location
from authentication.models import CustomUser
from employees.models import Employee
from inventory.models import Item, Category
from business_settings.models import BusinessProfile
from phonenumber_field.modelfields import PhoneNumberField

class Order(models.Model):
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='orders', blank=True, null=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='orders')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='customer_orders')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='handled_orders')
    order_number = models.CharField(max_length=20, unique=True, blank=True, null=True)
    
    # Customer Information
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    customer_phone = PhoneNumberField(blank=True, null=True)
    customer_email = models.EmailField(blank=True, null=True)
    
    # Order Status and Timing
    order_date = models.DateTimeField()
    status = models.CharField(max_length=20)
    
    # Financial Information
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Payment Information
    payment_status = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=20, blank=True, null=True)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
    
    # Refund Tracking
    refund_status = models.CharField(max_length=20, blank=True, null=True)
    remaining_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    refund_reason = models.TextField(blank=True, null=True)
    
    # Additional Fields
    notes = models.TextField(blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)  # Using Django's built-in JSONField
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        self.remaining_amount = self.total_amount - self.paid_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number} - {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='order_items')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='order_items', blank=True, null=True)
    
    # Item Details
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Discount Tracking
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_type = models.CharField(max_length=20, blank=True, null=True)
    
    # Return/Refund Tracking
    returned_quantity = models.PositiveIntegerField(default=0)
    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Item {self.item} in Order {self.order}"


class OrderHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='order_history')
    action = models.CharField(max_length=50)
    previous_status = models.CharField(max_length=20, blank=True, null=True)
    new_status = models.CharField(max_length=20)
    notes = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"History for Order {self.order} - Action: {self.action}"
