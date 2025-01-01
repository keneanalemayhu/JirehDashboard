import api from '../axios';
import { Category, CategoryFormData } from '@/types/dashboard/business/category';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export const categoryApi = {
  getCategories: async (locationId: number): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>(`/api/location/${locationId}/categories/`);
    return response.data.data.map((category: any) => ({
      id: category.id,
      locationId: category.location,
      name: category.name,
      description: category.description,
      isActive: category.is_active,
      isHidden: category.is_hidden,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    }));
  },

  createCategory: async (locationId: number, data: CategoryFormData): Promise<Category> => {
    const response = await api.post<ApiResponse<any>>(`/api/location/${locationId}/categories/`, {
      location: locationId,
      name: data.name,
      description: data.description,
      is_active: data.isActive,
      is_hidden: data.isHidden,
    });
    
    const category = response.data.data;
    return {
      id: category.id,
      locationId: category.location,
      name: category.name,
      description: category.description,
      isActive: category.is_active,
      isHidden: category.is_hidden,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  },

  updateCategory: async (locationId: number, categoryId: number, data: CategoryFormData): Promise<Category> => {
    const response = await api.put<ApiResponse<any>>(`/api/location/${locationId}/categories/${categoryId}/`, {
      location: locationId,
      name: data.name,
      description: data.description,
      is_active: data.isActive,
      is_hidden: data.isHidden,
    });
    
    const category = response.data.data;
    return {
      id: category.id,
      locationId: category.location,
      name: category.name,
      description: category.description,
      isActive: category.is_active,
      isHidden: category.is_hidden,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  },

  deleteCategory: async (locationId: number, categoryId: number): Promise<void> => {
    await api.delete(`/api/location/${locationId}/categories/${categoryId}/`);
  },
};
