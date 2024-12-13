from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from store.models import Store, Location
# Create your models here.

class Employee(models.Model):
    STATUS_CHOICES = [
        ('full_time', 'FULL_TIME'),
        ('part', 'Part'),
        ('contract', 'Contract'),
        ('intern', 'Intern')
    ]
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    phone = PhoneNumberField(unique=True)
    position = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    hire_date = models.DateField()
    is_active = models.BooleanField(default=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    employment_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
