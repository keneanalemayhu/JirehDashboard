// src/types/dashboard/business/owner/order.ts

import { Key, ReactNode } from "react";

/**
 * Core enums
 */
export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  READY = "READY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  ON_HOLD = "ON_HOLD",
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT = "CREDIT",
  TELEBIRR = "TELEBIRR",
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_MONEY = "MOBILE_MONEY",
}

/**
 * Base interfaces
 */
export interface CustomerInfo {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface OrderItem {
  name: ReactNode;
  id: Key | null | undefined;
  price: number;
  item_id: number;
  category_id: number;
  item_name: string;
  category_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

/**
 * Core Order interface
 */
export interface Order {
  // Identifiers
  order_id: number;
  order_number: string;
  businessId: number;
  locationId: number;
  user_id: number;
  employee_id: number;

  // Status
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;

  // Customer
  customer: CustomerInfo;

  // Order Details
  items: OrderItem[];
  total_amount: number;

  // Metadata
  employee_name: string;
  user_name: string;
  order_date: string;
  created_at: string;
  updated_at: string;
}

/**
 * Analytics interfaces
 */
export interface CategoryAnalytics {
  category_id: number;
  category_name: string;
  total_sales: number;
  total_items: number;
  total_revenue: number;
  average_order_value: number;
}

export interface ItemSalesAnalytics {
  item_id: number;
  item_name: string;
  category_name: string;
  total_quantity: number;
  total_revenue: number;
  average_price: number;
  stock_level: number;
}

export interface CustomerAnalytics {
  customer_phone: string;
  customer_name: string;
  total_orders: number;
  total_amount: number;
  average_order_value: number;
  last_order_date: string;
}

/**
 * Component Props
 */
export interface OrderFormProps {
  initialData?: Partial<Order>;
  onSubmit: (data: Order) => void;
  isLoading?: boolean;
}

export interface OrderTableProps {
  orders: Order[];
  onSort: (column: keyof Order) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  onPaymentStatusUpdate: (orderId: string, status: PaymentStatus) => void;
  isLoading?: boolean;
}

/**
 * Filter and Sort Types
 */
export type SortDirection = "asc" | "desc" | null;

export interface OrderFilters {
  status?: OrderStatus[];
  paymentStatus?: PaymentStatus[];
  paymentMethod?: PaymentMethod[];
  categoryIds?: number[];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

/**
 * Hook Return Type
 */
export interface UseOrdersReturn {
  // Data state
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: Error | null;

  // Filters and pagination
  filters: OrderFilters;
  currentPage: number;
  pageSize: number;
  totalPages: number;

  // Actions
  setFilters: (filters: Partial<OrderFilters>) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  selectOrder: (order: Order | null) => void;

  // Order operations
  createOrder: (order: Omit<Order, "order_id">) => Promise<void>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Analytics
  getAnalyticsByCategory: () => CategoryAnalytics[];
  getTopSellingItems: (limit?: number) => ItemSalesAnalytics[];
  getCustomerAnalytics: () => CustomerAnalytics[];

  sortColumn: keyof Order | null;
  sortDirection: "asc" | "desc" | null;
  handleSort: (column: keyof Order) => void;
  paginatedOrders: Order[];
}

// Constants
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100] as const;

export const DEFAULT_FILTERS: OrderFilters = {
  status: undefined,
  paymentStatus: undefined,
  paymentMethod: undefined,
  categoryIds: undefined,
  startDate: undefined,
  endDate: undefined,
  searchTerm: undefined,
};
