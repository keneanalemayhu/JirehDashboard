// types/dashboard/business/order.ts
export interface OrderItem {
  item_id: string;
  item_name?: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderData {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  items: OrderItem[];
}

export interface Order {
  id: string;
  location_id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  total_amount: number;
  items: OrderItem[];
  status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  employee_name?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'cancelled';

export const PaymentStatuses = {
  PENDING: 'pending' as PaymentStatus,
  PAID: 'paid' as PaymentStatus,
  CANCELLED: 'cancelled' as PaymentStatus,
} as const;

export const OrderStatuses = {
  PENDING: 'pending' as OrderStatus,
  PROCESSING: 'processing' as OrderStatus,
  COMPLETED: 'completed' as OrderStatus,
  CANCELLED: 'cancelled' as OrderStatus,
} as const;

export interface UpdateOrderData {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
}

export interface OrderFilters {
  status: 'all' | OrderStatus;
  paymentStatus: 'all' | PaymentStatus;
  timeframe: 'all' | 'today' | 'this_week' | 'this_month';
  searchTerm?: string;
}

export interface OrderListProps {
  locationId: number;
}

export interface OrderDetailsProps {
  orderId: string;
}

export interface OrderSummaryProps {
  order: Order;
}

export interface OrderItemProps {
  item: OrderItem;
}

export interface OrderActionsProps {
  order: Order;
  onUpdate: (data: UpdateOrderData) => void;
}

export interface OrderFiltersProps {
  filters: OrderFilters;
  onChange: (filters: OrderFilters) => void;
}