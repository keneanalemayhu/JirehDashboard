import { api } from "./api";
import { User, UserFormData } from "@/types/dashboard/business/user";

export const userApi = {
  // Get all users for a business
  getUsers: async (businessId: number): Promise<User[]> => {
    console.log("[userApi.getUsers] Fetching users for business:", businessId);
    try {
      const response = await api.get(`/api/auth/register-user/`);
      console.log("[userApi.getUsers] Success:", response.data);
      return response.data.data.map((user: any) => ({
        id: user.id,
        username: user.user_name,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        role: user.role,
        location: user.location, // TODO: Add location name
        isActive: user.is_active,
        lastLogin: null, // TODO: Add last login
      }));
    } catch (error: any) {
      console.error("[userApi.getUsers] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },

  // Create a new user
  createUser: async (businessId: number, data: UserFormData): Promise<User> => {
    console.log("[userApi.createUser] Creating user for business:", businessId);
    console.log("[userApi.createUser] Request data:", data);
    try {
      const response = await api.post(`/api/auth/register-user/`, {
        user_name: data.username,
        full_name: data.name,
        email: data.email,
        phone_number: data.phone,
        location_id: data.location,
        role: data.role,
        is_active: data.isActive,
      });
      console.log("[userApi.createUser] Success:", response.data);
      const user = response.data.data;
      return {
        id: user.id,
        username: user.user_name,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        role: user.role,
        location: user.location, // TODO: Add location name
        isActive: user.is_active,
      };
    } catch (error: any) {
      console.error("[userApi.createUser] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        },
      });
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (businessId: number, userId: string, data: Partial<UserFormData>): Promise<User> => {
    console.log("[userApi.updateUser] Updating user:", userId, "for business:", businessId);
    console.log("[userApi.updateUser] Update data:", data);
    try {
      const response = await api.patch(`/api/auth/register-user/${userId}/`, {
        user_name: data.username,
        full_name: data.name,
        email: data.email,
        phone_number: data.phone,
        location_id: data.location,
        role: data.role,
        is_active: data.isActive,
      });
      console.log("[userApi.updateUser] Success:", response.data);
      const user = response.data.data;
      return {
        id: user.id,
        username: user.user_name,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        role: user.role,
        location: user.location, // TODO: Add location name
        isActive: user.is_active,
      };
    } catch (error: any) {
      console.error("[userApi.updateUser] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (businessId: number, userId: string): Promise<void> => {
    console.log("[userApi.deleteUser] Deleting user:", userId, "from business:", businessId);
    try {
      await api.delete(`/api/auth/register-user/${userId}/`);
      console.log("[userApi.deleteUser] Success");
    } catch (error: any) {
      console.error("[userApi.deleteUser] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },
};
