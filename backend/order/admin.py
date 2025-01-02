from django.contrib import admin
from .models import Order, OrderHistory, OrderItem

# Register your models here.
admin.site.register(Order)
admin.site.register(OrderHistory)
admin.site.register(OrderItem)
