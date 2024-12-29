from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings

from business_settings.models import BusinessProfile

# Create your models here.

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('FAILED', 'Failed'),
        ('EXPIRED', 'Expired'),
    ]
    SUBSCRIPTION_STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('SUSPENDED', 'Suspended'),
    ]

    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='subscriptions', blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    subscription_status = models.CharField(max_length=10, choices=SUBSCRIPTION_STATUS_CHOICES, default='INACTIVE')
    last_payment_date = models.DateTimeField(null=True, blank=True)
    next_billing_date = models.DateTimeField()
    retry_count = models.IntegerField(default=0)
    last_retry_date = models.DateTimeField(null=True, blank=True)
    payment_history = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.business.name} - {self.subscription_status}"