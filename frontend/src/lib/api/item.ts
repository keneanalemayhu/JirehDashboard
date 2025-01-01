import api from '../axios';
import { Item, ItemFormData } from '@/types/dashboard/business/item';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export const itemApi = {
  getItems: async (categoryId: number): Promise<Item[]> => {
    const response = await api.get<ApiResponse<Item[]>>(`/api/category/${categoryId}/items/`);
    return response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      barcode: item.barcode,
      price: item.price,
      quantity: item.quantity,
      categoryId: item.category,
      isActive: item.is_active,
      isHidden: item.is_hidden,
      isTemporary: item.is_temporary,
      expiryHours: item.expiry_hours,
      autoResetQuantity: item.auto_reset_quantity,
      lastQuantityReset: item.last_quantity_reset ? new Date(item.last_quantity_reset) : null,
      lastInventoryUpdate: new Date(item.last_inventory_update),
    }));
  },

  createItem: async (categoryId: number, data: ItemFormData): Promise<Item> => {
    console.log('Creating item with data:', {
      name: data.name,
      barcode: data.barcode,
      price: data.price,
      quantity: data.quantity,
      is_active: data.isActive,
      is_hidden: data.isHidden,
      is_temporary: data.isTemporary,
      expiry_hours: data.expiryHours,
      auto_reset_quantity: data.autoResetQuantity,
    });
    const response = await api.post<ApiResponse<any>>(`/api/category/${categoryId}/items/`, {
      name: data.name,
      barcode: data.barcode,
      price: data.price,
      quantity: data.quantity,
      is_active: data.isActive,
      is_hidden: data.isHidden,
      is_temporary: data.isTemporary,
      expiry_hours: data.expiryHours,
      auto_reset_quantity: data.autoResetQuantity,
    });
    
    const item = response.data.data;
    return {
      id: item.id,
      name: item.name,
      barcode: item.barcode,
      price: item.price,
      quantity: item.quantity,
      categoryId: item.category,
      isActive: item.is_active,
      isHidden: item.is_hidden,
      isTemporary: item.is_temporary,
      expiryHours: item.expiry_hours,
      autoResetQuantity: item.auto_reset_quantity,
      lastQuantityReset: item.last_quantity_reset ? new Date(item.last_quantity_reset) : null,
      lastInventoryUpdate: new Date(item.last_inventory_update),
    };
  },

  updateItem: async (categoryId: number, itemId: string, data: ItemFormData): Promise<Item> => {
    const response = await api.put<ApiResponse<any>>(`/api/category/${categoryId}/items/${itemId}/`, {
      category: categoryId,
      name: data.name,
      barcode: data.barcode,
      price: data.price,
      quantity: data.quantity,
      is_active: data.isActive,
      is_hidden: data.isHidden,
      is_temporary: data.isTemporary,
      expiry_hours: data.expiryHours,
      auto_reset_quantity: data.autoResetQuantity,
    });
    
    const item = response.data.data;
    return {
      id: item.id,
      name: item.name,
      barcode: item.barcode,
      price: item.price,
      quantity: item.quantity,
      categoryId: item.category,
      isActive: item.is_active,
      isHidden: item.is_hidden,
      isTemporary: item.is_temporary,
      expiryHours: item.expiry_hours,
      autoResetQuantity: item.auto_reset_quantity,
      lastQuantityReset: item.last_quantity_reset ? new Date(item.last_quantity_reset) : null,
      lastInventoryUpdate: new Date(item.last_inventory_update),
    };
  },

  deleteItem: async (categoryId: number, itemId: string): Promise<void> => {
    await api.delete(`/api/category/${categoryId}/items/${itemId}/`);
  },

  checkBarcode: async (categoryId: number, barcode: string): Promise<boolean> => {
    try {
      const items = await itemApi.getItems(categoryId);
      return !items.some(item => item.barcode === barcode);
    } catch (err) {
      console.error('Error checking barcode:', err);
      return false;
    }
  },
};
