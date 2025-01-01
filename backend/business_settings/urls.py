from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BusinessProfileViewSet

router = DefaultRouter()
router.register(r'stores', BusinessProfileViewSet, basename='store')

urlpatterns = [
    path('', include(router.urls)),
]
