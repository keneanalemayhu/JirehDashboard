from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from authentication.models import CustomUser
# Create your models here.

class Store(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact_number = PhoneNumberField()
    registration_number = models.CharField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owned_stores')
    admin = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='managed_stores')

    def __str__(self):
        return self.name

class Location(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='locations')
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact_number = PhoneNumberField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.store.name}"
