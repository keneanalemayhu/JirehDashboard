from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from authentication.models import CustomUser
from business_settings.models import BusinessProfile
# Create your models here.

class Location(models.Model):
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='locations', blank=True, null=True)
    name = models.CharField(max_length=100)
    address = models.TextField()
    contact_number = models.CharField(max_length=20)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
