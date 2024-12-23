import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';  
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
    const accessToken = localStorage.getItem('accessToken');

    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    console.log('Sending login request with:', { identifier, password: '***' });
    try {
      const response = await axios.post('/api/auth/login/', {
        email: identifier,  // Keep as 'email' for backend compatibility
        password
      });
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

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await api.post('/api/auth/logout/', {
          refresh: refreshToken
        });
      }

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to login
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if server request fails
      localStorage.clear();
      setUser(null);
      setIsAuthenticated(false);
      router.push('/auth/login');
    }
  };

  const resetPasswordRequest = async (email: string) => {
    try {
      const response = await api.post('/api/auth/password-reset/', { email });
      if (response.data.success) {
        console.log('Password reset email sent successfully');
        return response; // Return the response for further handling
      } else {
        console.error('Password reset email failed:', response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Password reset email error:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    try {
      const response = await api.post('/api/auth/password-reset/confirm/', {
        email,
        token,
        new_password: newPassword,
      });

      if (response.data.success) {
        console.log('Password reset successful:', response.data.message);
        return response;
      } else {
        console.error('Password reset failed:', response.data.message);
        throw new Error(response.data.message || 'Password reset failed');
      }
    } catch (error: any) {
      console.error('Reset Password Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  };


  return { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout ,
    resetPasswordRequest,
    resetPassword,
  };
}
