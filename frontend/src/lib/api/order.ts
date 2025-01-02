//src/lib/api/order.ts
import { api } from './api';
import { CreateOrderData, Order } from '@/types/dashboard/business/order';

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: any;
}

export const orderApi = {
    createOrder: async (locationId: number, data: CreateOrderData): Promise<Order> => {
        try {
            const response = await api.post<ApiResponse<any>>(`/api/location/${locationId}/orders/`, {
                location: locationId,
                customer_name: data.customer_name || '',
                customer_phone: data.customer_phone || '',
                customer_email: data.customer_email || '',
                items: data.items.map(item => ({
                    item: item.item_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price
                }))
            });
            
            const order = response.data.data;
            return {
                id: order.id,
                location_id: order.location,
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                customer_email: order.customer_email,
                total_amount: order.total_amount,
                items: order.items,
                status: order.status,
                payment_status: order.payment_status,
                created_at: order.created_at,
                updated_at: order.updated_at
            };
        } catch (error: any) {
            console.error("[orderApi.createOrder] Error:", error);
            if (error.response?.status === 401) {
                console.error("[orderApi.createOrder] Authentication failed. Token might be expired.");
            }
            throw error;
        }
    },

    getOrders: async (locationId: number): Promise<Order[]> => {
        console.log("[orderApi.getOrders] Fetching orders for location:", locationId);
        try {
            const response = await api.get<ApiResponse<any>>(`/api/location/${locationId}/orders/`);
            console.log("[orderApi.getOrders] Response:", response.data);
            
            if (!response.data) {
                throw new Error('No data received from server');
            }
            
            const orders = Array.isArray(response.data) ? response.data : [response.data];
            return orders.map((order: any) => ({
                id: order.id,
                location_id: order.location_id || order.location,
                customer_name: order.customer_name || '',
                customer_phone: order.customer_phone || '',
                customer_email: order.customer_email || '',
                total_amount: order.total_amount || 0,
                items: order.items || [],
                status: order.status || 'pending',
                payment_status: order.payment_status || 'pending',
                created_at: order.created_at || new Date().toISOString(),
                updated_at: order.updated_at || new Date().toISOString()
            }));
        } catch (error: any) {
            console.error("[orderApi.getOrders] Error:", error);
            if (error.response?.status === 401) {
                console.error("[orderApi.getOrders] Authentication failed. Token might be expired.");
            }
            throw new Error('Failed to get orders');
        }
    },

    getOrderDetails: async (locationId: number, orderId: string): Promise<Order> => {
        console.log("[orderApi.getOrderDetails] Fetching order:", orderId);
        try {
            const response = await api.get<ApiResponse<any>>(`/api/location/${locationId}/orders/${orderId}/`);
            console.log("[orderApi.getOrderDetails] Response:", response);
            
            if (!response.data.success || !response.data.data) {
                throw new Error('Failed to get order details');
            }
            
            const order = response.data.data;
            return {
                id: order.id,
                location_id: order.location_id || order.location,
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                customer_email: order.customer_email,
                total_amount: order.total_amount,
                items: order.items || [],
                status: order.status,
                payment_status: order.payment_status,
                created_at: order.created_at,
                updated_at: order.updated_at
            };
        } catch (error: any) {
            console.error("[orderApi.getOrderDetails] Error:", error);
            if (error.response?.status === 401) {
                console.error("[orderApi.getOrderDetails] Authentication failed. Token might be expired.");
            }
            throw error;
        }
    },
    updateOrder: async (locationId: number, orderId: string, data: any): Promise<Order> => {
        console.log("[orderApi.updateOrder] Updating order:", orderId);
        try {
            const response = await api.put<ApiResponse<any>>(`/api/location/${locationId}/orders/${orderId}/`, data);
            console.log("[orderApi.updateOrder] Response:", response);
            
            if (!response.data.success || !response.data.data) {
                throw new Error('Failed to update order');
            }
            
            const order = response.data.data;
            return {
                id: order.id,
                location_id: order.location_id || order.location,
                customer_name: order.customer_name,
                customer_phone: order.customer_phone,
                customer_email: order.customer_email,
                total_amount: order.total_amount,
                items: order.items || [],
                status: order.status,
                payment_status: order.payment_status,
                created_at: order.created_at,
                updated_at: order.updated_at
            };
        } catch (error: any) {
            console.error("[orderApi.updateOrder] Error:", error);
            if (error.response?.status === 401) {
                console.error("[orderApi.updateOrder] Authentication failed. Token might be expired.");
            }
            throw error;
        }
    }
};