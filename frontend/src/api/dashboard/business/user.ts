import axios from 'axios';

const API_URL = '/api/auth/register-user/'; // Adjust the URL based on your API setup

import { UserFormData } from "@/types/dashboard/business/user"; // Ensure this import is present
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
  updateUser: async (businessId: number, userId: string, userData: any) => {
    const response = await axios.put(`${API_URL}${userId}/`, { ...userData, businessId });
    return response.data;
  },
  deleteUser: async (businessId: number, userId: string) => {
    await axios.delete(`${API_URL}${userId}/`);
  },
};