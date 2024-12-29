from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CategoryViewSet, ItemViewSet, 
                   ExpenseViewSet, ExpenseCategoryViewSet)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'items', ItemViewSet, basename='item')
router.register(r'expenses', ExpenseViewSet, basename='expense')
router.register(r'expense-categories', ExpenseCategoryViewSet, basename='expense-category')

urlpatterns = [
    path('', include(router.urls)),
]
