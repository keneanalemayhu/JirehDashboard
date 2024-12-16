from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class UserRegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'

    def test_user_registration(self):
        # Test successful user registration
        user_data = {
            'email': 'testuser@example.com',
            'full_name': 'Test User',
            'user_name': 'testuser',
            'phone': '+1234567890',
            'password': 'strongpassword123',
            'password2': 'strongpassword123'
        }
        
        response = self.client.post(self.register_url, user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='testuser@example.com').exists())

    def test_user_login(self):
        # Create a user first
        user = User.objects.create_user(
            email='loginuser@example.com',
            password='loginpassword123',
            full_name='Login User',
            user_name='loginuser',
            phone='+1234567890'
        )
        
        # Test successful login
        login_data = {
            'email': 'loginuser@example.com',
            'password': 'loginpassword123'
        }
        
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)