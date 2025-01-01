from rest_framework import routers
from django.urls import path, include
from .views import LocationViewSet, StoreViewSet
from employees.views import EmployeeViewSet
from inventory.views import CategoryViewSet, ItemViewSet

router = routers.DefaultRouter()
router.register(r'stores', StoreViewSet, basename='stores')
router.register(r'store/(?P<store_pk>\d+)/locations', LocationViewSet, basename='store-locations')
router.register(r'store/(?P<store_pk>\d+)/employees', EmployeeViewSet, basename='store-employees')
router.register(r'location/(?P<location_pk>\d+)/categories', CategoryViewSet, basename='location-categories')
router.register(r'category/(?P<category_pk>\d+)/items', ItemViewSet, basename='category-items')

urlpatterns = [
    path('', include(router.urls)),
]
