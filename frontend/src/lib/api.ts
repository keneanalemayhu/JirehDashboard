import axios, { AxiosInstance } from 'axios';
import { Employee, EmployeeFormData } from '@/types/dashboard/business/retail/owner/employee';

export interface Location {
  id: number;
  name: string;
  address: string;
  contact_number: string;
  is_active: boolean;
}

interface User {
  // Add user properties here
}

interface Order {
  // Add order properties here
}

interface PaymentStatus {
  // Add payment status properties here
}

interface Expense {
  // Add expense properties here
}

interface ExpenseFormData {
  // Add expense form data properties here
}

interface ExpenseCategory {
  id: number;
  name: string;
  business: any;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  business: any;
  created_at: string;
  updated_at: string;
}

class Api {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.auth.refresh(refreshToken);
              const { access: newAccessToken } = response.data;
              
              // Update the token in localStorage
              localStorage.setItem('accessToken', newAccessToken);
              
              // Update the Authorization header
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              
              // Retry the original request
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/auth/login';
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth API
  auth = {
    login: async (email: string, password: string) => {
      const response = await this.client.post('/api/auth/login/', { email, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      return response;
    },

    refresh: async (refreshToken: string) => {
      return await this.client.post('/api/auth/token/refresh/', {
        refresh: refreshToken
      });
    },

    logout: async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await this.client.post('/api/auth/logout/', {
            refresh: refreshToken
          });
        }
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },

    getUser: async () => {
      return await this.client.get('/api/auth/user/');
    },
  };

  // Locations API
  locations = {
    get: async () => {
      const response = await this.client.get<Location[]>('/api/store/locations/');
      console.log('Locations API Response:', response.data);
      return response.data;
    },

    getById: async (id: number) => {
      const response = await this.client.get<Location>(`/api/store/locations/${id}/`);
      return response.data;
    },
  };

  // Categories API
  categories = {
    get: async () => {
      const response = await this.client.get<Category[]>('/api/inventory/categories/');
      console.log('Categories API Response:', response.data);
      return response.data;
    },

    getById: async (id: number) => {
      const response = await this.client.get<Category>(`/api/inventory/categories/${id}/`);
      return response.data;
    },
  };

  // Employees API
  employees = {
    get: async () => {
      const response = await this.client.get<Employee[]>('/api/employees/employees/');
      return response;
    },

    getById: async (id: string) => {
      const response = await this.client.get<Employee>(`/api/employees/employees/${id}/`);
      return response;
    },

    create: async (data: EmployeeFormData) => {
      const response = await this.client.post<Employee>('/api/employees/employees/', data);
      return response;
    },

    update: async (id: string, data: EmployeeFormData) => {
      const response = await this.client.put<Employee>(`/api/employees/employees/${id}/`, data);
      return response;
    },

    delete: async (id: string) => {
      const response = await this.client.delete(`/api/employees/employees/${id}/`);
      return response;
    },
  };

  // Users API
  users = {
    getAll: async () => {
      const response = await this.client.get<User[]>('/api/users/');
      return response.data;
    },
    getUsers: async () => {
      const response = await this.client.get<User[]>('/api/users/');
      return response.data;
    },
    fetchUsers: async () => {
      const response = await this.client.get<User[]>('/api/users/');
      return response.data;
    },
  };

  // Orders API
  orders = {
    get: async () => {
      const response = await this.client.get<Order[]>('/api/store/orders/');
      return response.data;
    },

    getById: async (id: string) => {
      const response = await this.client.get<Order>(`/api/store/orders/${id}/`);
      return response.data;
    },

    create: async (data: Order) => {
      const response = await this.client.post<Order>('/api/store/orders/', data);
      return response.data;
    },

    update: async (id: string, data: Partial<Order>) => {
      const response = await this.client.put<Order>(`/api/store/orders/${id}/`, data);
      return response.data;
    },

    updatePaymentStatus: async (id: string, status: PaymentStatus) => {
      const response = await this.client.patch<Order>(`/api/store/orders/${id}/payment_status/`, { payment_status: status });
      return response.data;
    },

    delete: async (id: string) => {
      await this.client.delete(`/api/store/orders/${id}/`);
    }
  };

  // Expenses API
  expenses = {
    get: async () => {
      const response = await this.client.get<Expense[]>('/api/inventory/expenses/');
      return response.data;
    },

    getById: async (id: number) => {
      const response = await this.client.get<Expense>(`/api/inventory/expenses/${id}/`);
      return response.data;
    },

    create: async (data: ExpenseFormData) => {
      const response = await this.client.post<Expense>('/api/inventory/expenses/', data);
      return response.data;
    },

    update: async (id: number, data: ExpenseFormData) => {
      const response = await this.client.put<Expense>(`/api/inventory/expenses/${id}/`, data);
      return response.data;
    },

    delete: async (id: number) => {
      await this.client.delete(`/api/inventory/expenses/${id}/`);
    }
  };

  // Expense Categories API
  expenseCategories = {
    get: async () => {
      const response = await this.client.get<ExpenseCategory[]>('/api/inventory/expense-categories/');
      console.log('Expense Categories API Response:', response.data);
      return response.data;
    },

    getById: async (id: number) => {
      const response = await this.client.get<ExpenseCategory>(`/api/inventory/expense-categories/${id}/`);
      return response.data;
    },

    create: async (data: Omit<ExpenseCategory, "id" | "business" | "created_at" | "updated_at">) => {
      const response = await this.client.post<ExpenseCategory>('/api/inventory/expense-categories/', data);
      return response.data;
    },

    update: async (id: number, data: Partial<Omit<ExpenseCategory, "id" | "business" | "created_at" | "updated_at">>) => {
      const response = await this.client.put<ExpenseCategory>(`/api/inventory/expense-categories/${id}/`, data);
      return response.data;
    },

    delete: async (id: number) => {
      await this.client.delete(`/api/inventory/expense-categories/${id}/`);
    }
  };
}

export const api = new Api();