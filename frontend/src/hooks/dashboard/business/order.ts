// hooks/dashboard/business/order.ts
import { useState, useEffect, useCallback } from 'react';
import { orderApi } from '@/lib/api/order';
import { toast } from 'sonner';
import { CreateOrderData, Order, OrderFilters } from '@/types/dashboard/business/order';

export const useOrder = (locationId: number) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
 
  const createOrder = async (orderData: CreateOrderData) => {
    setIsLoading(true);
    try {
      const response = await orderApi.createOrder(locationId, orderData);
      setCurrentOrderId(response.id);
      setIsQRCodeDialogOpen(true);
      toast.success('Order created successfully');
      return response.id;
    } catch (error: any) {
      console.error("[useOrder.createOrder] Error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
 
  const getInvoice = async () => {
    if (!currentOrderId) {
      toast.error('No order selected');
      return null;
    }
    try {
      const response = await orderApi.getOrderDetails(locationId, currentOrderId);
      console.log('[useOrder.getInvoice] Invoice data:', response);
      return response;
    } catch (error) {
      console.error("[useOrder.getInvoice] Error:", error);
      toast.error('Failed to get invoice');
      return null;
    }
  };
 
  return {
    isLoading,
    isQRCodeDialogOpen, 
    setIsQRCodeDialogOpen,
    currentOrderId,
    createOrder,
    getInvoice,
  };
};

export const useOrders = (locationId: number) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    paymentStatus: 'all',
    timeframe: 'all',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderApi.getOrders(locationId);
      console.log('[useOrders.fetchOrders] Orders:', response);
      setOrders(response);
    } catch (error: any) {
      console.error("[useOrders.fetchOrders] Error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrder = async (orderId: string, data: any) => {
    try {
      await orderApi.updateOrder(locationId, orderId, data);
      toast.success('Order updated successfully');
      fetchOrders(); // Refresh orders after update
    } catch (error: any) {
      console.error("[useOrders.updateOrder] Error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to update order';
      toast.error(errorMessage);
    }
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Apply filters and sorting
  const filteredOrders = orders.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (filters.paymentStatus !== 'all' && order.payment_status !== filters.paymentStatus) return false;
    
    if (filters.timeframe !== 'all') {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      
      switch (filters.timeframe) {
        case 'today':
          return orderDate >= today;
        case 'this_week':
          const lastWeek = new Date(now.setDate(now.getDate() - 7));
          return orderDate >= lastWeek;
        case 'this_month':
          const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
          return orderDate >= lastMonth;
        default:
          return true;
      }
    }
    
    return true;
  }).sort((a, b) => {
    const aValue = a[sortColumn as keyof Order];
    const bValue = b[sortColumn as keyof Order];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc'
      ? (aValue as any) - (bValue as any)
      : (bValue as any) - (aValue as any);
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + pageSize);

  const setPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return {
    orders: filteredOrders,
    paginatedOrders,
    isLoading,
    error,
    filters,
    setFilters,
    selectedOrder,
    setSelectedOrder,
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    updateOrder,
    handleSort,
    sortColumn,
    sortDirection,
    refresh: fetchOrders,
  };
};