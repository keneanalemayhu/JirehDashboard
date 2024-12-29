from django.db import models
from store.models import Location

# Create your models here.

class Warehouse(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='warehouses')
    name = models.CharField(max_length=100)
    address = models.TextField()
    capacity = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total storage capacity in square meters")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.location.name}"

class WarehouseZone(models.Model):
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='zones')
    name = models.CharField(max_length=100)
    zone_type = models.CharField(max_length=50, choices=[
        ('storage', 'Storage'),
        ('receiving', 'Receiving'),
        ('shipping', 'Shipping'),
        ('quarantine', 'Quarantine'),
    ])
    capacity = models.DecimalField(max_digits=10, decimal_places=2, help_text="Zone capacity in square meters")
    temperature_controlled = models.BooleanField(default=False)
    temperature_range = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.warehouse.name} - {self.name}"
