import { api } from './api';
import { Location, LocationFormData } from '@/types/dashboard/business/location';

export const locationApi = {
  getLocations: async (storeId: number): Promise<Location[]> => {
    console.log("[locationApi.getLocations] Fetching locations for store:", storeId);
    try {
      const response = await api.get(`/api/store/${storeId}/locations/`);
      console.log("[locationApi.getLocations] Success:", response.data);
      return response.data.data.map((location: any) => ({
        id: location.id,
        businessId: location.store,
        name: location.name,
        address: location.address,
        contactNumber: location.contact_number,
        isActive: location.is_active,
        createdAt: location.created_at,
        updatedAt: location.updated_at,
      }));
    } catch (error: any) {
      console.error("[locationApi.getLocations] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },

  createLocation: async (storeId: number, data: LocationFormData): Promise<Location> => {
    console.log("[locationApi.createLocation] Creating location for store:", storeId);
    try {
      const response = await api.post(`/api/store/${storeId}/locations/`, {
        name: data.name,
        address: data.address,
        contact_number: data.contactNumber,
        is_active: data.isActive,
      });
      console.log("[locationApi.createLocation] Success:", response.data);
      const location = response.data.data;
      return {
        id: location.id,
        businessId: location.store,
        name: location.name,
        address: location.address,
        contactNumber: location.contact_number,
        isActive: location.is_active,
        createdAt: location.created_at,
        updatedAt: location.updated_at,
      };
    } catch (error: any) {
      console.error("[locationApi.createLocation] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },

  updateLocation: async (storeId: number, locationId: number, data: LocationFormData): Promise<Location> => {
    console.log("[locationApi.updateLocation] Updating location:", locationId);
    try {
      const response = await api.put(`/api/store/${storeId}/locations/${locationId}/`, {
        name: data.name,
        address: data.address,
        contact_number: data.contactNumber,
        is_active: data.isActive,
      });
      console.log("[locationApi.updateLocation] Success:", response.data);
      const location = response.data.data;
      return {
        id: location.id,
        businessId: location.store,
        name: location.name,
        address: location.address,
        contactNumber: location.contact_number,
        isActive: location.is_active,
        createdAt: location.created_at,
        updatedAt: location.updated_at,
      };
    } catch (error: any) {
      console.error("[locationApi.updateLocation] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },

  deleteLocation: async (storeId: number, locationId: number): Promise<void> => {
    console.log("[locationApi.deleteLocation] Deleting location:", locationId);
    try {
      await api.delete(`/api/store/${storeId}/locations/${locationId}/`);
      console.log("[locationApi.deleteLocation] Success");
    } catch (error: any) {
      console.error("[locationApi.deleteLocation] Error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config,
      });
      throw error;
    }
  },
};
