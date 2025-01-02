import axios from 'axios';

const API_URL = '/api/auth/register-user/'; // Adjust the URL based on your API setup

import { User, UserFormData } from "@/types/dashboard/business/user"; // Ensure this import is present
import api from '@/lib/axios';
export const userApi = {
  getUsers: async (businessId: number) => {
    const response = await axios.get(`${API_URL}?businessId=${businessId}`);
    return response.data;
  },
  createUser: async (businessId: number, userData: UserFormData) => {
    const response = await axios.post(API_URL, {
      user_name: userData.username, // Updated field name
      full_name: userData.name, // Updated field name
      email: userData.email,
      phone_number: userData.phone,
      location_id: userData.location_id,
      role: userData.role,
      is_active: userData.isActive,
      businessId,
    });
    return response.data;
  },
  updateUser: async (businessId: number, userId: string, userData: UserFormData): Promise<User> => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log("[userApi.updateUser] Updating user:", userId, "for business:", businessId);
    try {
      const response = await api.patch(`/api/auth/register-user/${userId}/`, {
        user_name: userData.username,
        full_name: userData.name,
        email: userData.email,
        phone_number: userData.phone,
        location_id: userData.location_id,
        role: userData.role,
        is_active: userData.isActive,
        businessId  // Add this
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Update failed');
      }

      const user = response.data.data;
      return {
        id: user.id.toString(),  // Ensure id is returned as string
        username: user.user_name,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        role: user.role,
        location_id: user.location_id?.toString(),
        isActive: user.is_active,
      };
    } catch (error) {
      console.error("[userApi.updateUser] Error:", error);
      throw error;
    }
  },
  deleteUser: async (businessId: number, userId: string) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const response = await axios.delete(`${API_URL}${userId}/`, { data: { businessId } });
    return response.data;
  },
};
