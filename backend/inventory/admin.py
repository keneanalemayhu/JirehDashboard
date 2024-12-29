from django.contrib import admin
from .models import Category, Item, Expense


# Register your models here
admin.site.register(Category)
admin.site.register(Item)
admin.site.register(Expense)
