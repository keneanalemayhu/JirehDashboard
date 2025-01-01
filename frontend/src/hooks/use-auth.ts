import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export interface User {
  id: number;
  email: string;
  name?: string;
  user_name?: string;
  is_superuser: boolean;
}

export interface BusinessProfileData {
  business_name?: string;
  business_phone?: string;
  business_address?: string;
  tax_id?: string;
  website?: string;
}

export interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  name?: string;
  user_name?: string;
  phone_number?: string;
  business_profile?: BusinessProfileData;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login/', {
        identifier,
        password
      });

      if (!response.data.success) {
        throw new Error(response.data.detail || 'Login failed');
      }

      const { access, refresh, user, role } = response.data;
      
      // Store tokens and user info
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', role || 'user');

      setUser(user);
      setIsAuthenticated(true);

      // Redirect based on role
      if (role === 'super_admin') {
        router.push('/dashboard/sadmin');
      } else {
        router.push(`/dashboard/business/${role || 'owner'}`);
      }
    } catch (error: any) {
      console.error('Login Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      setIsAuthenticated(false);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log('Sending Registration Data:', JSON.stringify(userData, null, 2));
      const response = await api.post('/api/auth/register/', userData);
      console.log('Registration Response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }

      // After successful registration, redirect to login
      router.push('/auth/login');
      return response.data;
    } catch (error: any) {
      console.error('Registration Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const resetPasswordRequest = async (email: string) => {
    try {
      const response = await api.post('/api/auth/password-reset/', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await api.post('/api/auth/password-reset/confirm/', {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    resetPasswordRequest,
    resetPassword,
  };
}