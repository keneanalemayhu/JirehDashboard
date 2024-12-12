// src/types/dashboard/business/retail/owner/order.ts

/**
 * Core entity interfaces
 */
export interface Order {
  order_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  employee_name: string;
  user_name: string;
  total_amount: number;
  payment_status: PaymentStatus;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

/**
 * Form-related types
 */
export interface OrderFormProps {
  initialData: Order;
  onSubmit: (data: Order) => void;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnConfig {
  key: keyof Order;
  label: string;
  width?: string;
}

export interface OrderTableProps {
  orders: Order[];
  onSort: (column: keyof Order) => void;
  onStatusUpdate: (order: Order) => void;
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
  selectedOrder: Order | null;
}

export interface OrderTableHeaderProps {
  onSort: (column: keyof Order) => void;
}

export interface OrderTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface OrderTableSettingsProps {
  showCurrency: boolean;
  onShowCurrencyChange: (show: boolean) => void;
  statusFilter: string[];
  onStatusFilterChange: (status: string) => void;
}

/**
 * Hook return type
 */
export interface UseOrdersReturn {
  // Data
  orders: Order[];
  paginatedOrders: Order[];
  filteredOrders: Order[];
  selectedOrder: Order | null;

  // State setters
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;

  // UI state
  filterValue: string;
  setFilterValue: (value: string) => void;
  isDetailsDialogOpen: boolean;
  setIsDetailsDialogOpen: (open: boolean) => void;
  statusFilter: string[];

  // Table state
  pageSize: number;
  currentPage: number;
  sortColumn: keyof Order | null;
  sortDirection: SortDirection;

  // Handlers
  handleSort: (column: keyof Order) => void;
  handleUpdatePaymentStatus: (order: Order) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleStatusFilterChange: (status: string) => void;
}

/**
 * Configuration and constants
 */
export const COLUMNS: ColumnConfig[] = [
  { key: "order_id", label: "Order ID", width: "w-[120px]" },
  { key: "item_name", label: "Item" },
  { key: "quantity", label: "Quantity", width: "w-[100px]" },
  { key: "unit_price", label: "Unit Price", width: "w-[120px]" },
  { key: "subtotal", label: "Subtotal", width: "w-[120px]" },
  { key: "employee_name", label: "Employee" },
  { key: "user_name", label: "Seller" },
  { key: "total_amount", label: "Total Amount", width: "w-[120px]" },
  { key: "payment_status", label: "Payment Status", width: "w-[130px]" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const initialOrders: Order[] = [
  {
    order_id: "ORD-001",
    item_name: "Sample Product",
    quantity: 2,
    unit_price: 1000,
    subtotal: 2000,
    employee_name: "John Doe",
    user_name: "Jane Smith",
    total_amount: 2000,
    payment_status: PaymentStatus.PENDING,
  },
];

export const DEFAULT_SETTINGS = {
  showCurrency: true,
  statusFilter: [],
};
