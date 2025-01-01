import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface StoreFormData {
  name: string;
  address: string;
  contactNumber: string;
  registrationNumber: string;
  isActive?: boolean;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  contactNumber: string;
  registrationNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: number;
  admin: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export const storeApi = {
  getStores: async (): Promise<ApiResponse<Store[]>> => {
    const response = await axios.get(`${API_BASE_URL}/stores/`);
    return response.data;
  },

  createStore: async (data: StoreFormData): Promise<Store> => {
    const response = await axios.post(`${API_BASE_URL}/stores/`, {
      name: data.name,
      address: data.address,
      contact_number: data.contactNumber,
      registration_number: data.registrationNumber,
      is_active: data.isActive ?? true,
    });
    return response.data.data;
  },

  updateStore: async (id: number, data: StoreFormData): Promise<Store> => {
    const response = await axios.put(`${API_BASE_URL}/stores/${id}/`, {
      name: data.name,
      address: data.address,
      contact_number: data.contactNumber,
      registration_number: data.registrationNumber,
      is_active: data.isActive ?? true
    });
    return response.data.data;
  },

  deleteStore: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/stores/${id}/`);
  }
};
