from django.urls import path, include
from rest_framework import routers
from .views import (
    CategoryViewSet,
    ItemViewSet,
    # BusinessViewSet,
    ExpenseCategoryViewSet,
    ExpenseViewSet,
)

router = routers.DefaultRouter()
# Top-level resources
# router.register(r'locations', LocationViewSet, basename='locations')
# router.register(r'businesses', BusinessViewSet, basename='businesses')


# Nested resources for locations
router.register(
    r'location/(?P<location_pk>\d+)/categories',
    CategoryViewSet,
    basename='location-categories'
)
router.register(
    r'category/(?P<category_pk>\d+)/items',
    ItemViewSet,
    basename='category-items'
)

# Nested resources for businesses
router.register(
    r'business/(?P<business_pk>\d+)/expense-categories',
    ExpenseCategoryViewSet,
    basename='business-expense-categories'
)
router.register(
    r'business/(?P<business_pk>\d+)/expenses',
    ExpenseViewSet,
    basename='business-expenses'
)

urlpatterns = [
    path('', include(router.urls)),
]
