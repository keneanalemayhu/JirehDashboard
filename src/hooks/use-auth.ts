import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';  // Use the configured axios instance
import api from '@/lib/axios';

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  is_superuser: boolean;
}

export interface BusinessProfileData {
    business_name?: string;
    business_type?: string;
    business_phone?: string;
    business_address?: string;
    tax_id?: string;
    website?: string;
  }

  export interface RegisterData {
    email: string;
    password1: string;
    password2: string;
    first_name?: string;
    last_name?: string;
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
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login/', { email, password });
      const { access, refresh, user, business_type, role } = response.data;

      // Store tokens and user info
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('business_type', business_type);
      localStorage.setItem('role', role);

      setUser(user);
      setIsAuthenticated(true);

      // Redirect based on role and business type
      if (role === 'super_admin') {
        router.push('/dashboard/sadmin');
      } else if (business_type) {
        router.push(`/dashboard/business/${business_type}/${role}`);
      } else {
        // Handle case where business_type is not available
        console.error('No business type available for user');
        throw new Error('No business type available');
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

      const { tokens, user } = response.data;
      if (!tokens || !tokens.access || !tokens.refresh) {
        throw new Error('Invalid response format: missing tokens');
      }
  
      // Store tokens and user info
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));
  
      setUser(user);
      setIsAuthenticated(true);
      router.push('/auth/login');
  
      return response.data;
    } catch (error: any) {
      console.error('Registration Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout 
  };
}