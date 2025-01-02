from rest_framework import routers
from django.urls import path, include
from .views import OrderViewSet

urlpatterns = [
    path('location/<int:location_id>/orders/', OrderViewSet.as_view({
        'get': 'list',
        'post': 'create'
    })),
    path('location/<int:location_id>/orders/<int:pk>/', OrderViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }))
]