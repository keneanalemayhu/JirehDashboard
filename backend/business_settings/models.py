from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from authentication.models import CustomUser

# Create your models here.

class BusinessProfile(models.Model):
    # BUSINESS_TYPES = [
    #     ('retail', 'Retail'),
    #     ('wholesale', 'Wholesale'),
    #     ('service', 'Service'),
    # ]

    owner = models.OneToOneField(
        CustomUser, 
        on_delete=models.CASCADE, 
        related_name='business_profile', 
        limit_choices_to={'role': 'owner'},
        blank=True,
        null=True
    )
    business_name = models.CharField(max_length=255, blank=True, null=True)
    business_phone = PhoneNumberField(blank=True, null=True, region=None)
    business_address = models.TextField(default='Not Provided', blank=True, null=True)
    registration_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    tax_id = models.CharField(max_length=50, blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business_name}"

    def generate_registration_number(self):
        registration_number = f"REG-{self.id}"
        return registration_number

    class Meta:
        verbose_name_plural = "Business Profiles"