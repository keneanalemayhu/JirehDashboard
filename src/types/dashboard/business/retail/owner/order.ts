// src/types/dashboard/business/retail/owner/order.ts

/**
 * Core entity interfaces
 */
export interface Order {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  employee: string;
  userName: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

export enum PaymentStatus {
  PENDING = "Pending",
  PAID = "Paid",
  FAILED = "Failed",
}

/**
 * Form-related types
 */
export type OrderFormData = Omit<Order, "id" | "subtotal" | "totalAmount">;

export interface OrderFormProps {
  initialData?: Partial<Order>;
  onSubmit: (data: OrderFormData) => void;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  orderId: boolean;
  itemName: boolean;
  quantity: boolean;
  unitPrice: boolean;
  subtotal: boolean;
  employee: boolean;
  userName: boolean;
  totalAmount: boolean;
  paymentStatus: boolean;
}

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
}

export type ColumnKey = keyof Omit<Order, "id" | "subtotal" | "totalAmount">;

export interface OrderTableProps {
  orders: Order[];
  columnsVisible: ColumnVisibility;
  onEdit: (order: Order) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  editingOrder: Order | null;
  onEditSubmit: () => void;
}

export interface OrderTableHeaderProps {
  columnsVisible: ColumnVisibility;
}

export interface OrderTableRowProps {
  order: Order;
  columnsVisible: ColumnVisibility;
  onEdit: (order: Order) => void;
}

export interface OrderTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface OrderTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (
    column: keyof ColumnVisibility,
    visible: boolean
  ) => void;
}

/**
 * Hook return type
 */
export interface UseOrdersReturn {
  // Data
  orders: Order[];
  paginatedOrders: Order[];
  filteredOrders: Order[];
  editingOrder: Order | null;

  // State setters
  setOrders: (orders: Order[]) => void;
  setEditingOrder: (order: Order | null) => void;

  // UI state
  filterValue: string;
  setFilterValue: (value: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;

  // Table state
  columnsVisible: ColumnVisibility;
  setColumnsVisible: (visibility: ColumnVisibility) => void;
  pageSize: number;
  currentPage: number;
  sortColumn: keyof Order | null;
  sortDirection: SortDirection;

  // Handlers
  handleSort: (column: keyof Order) => void;
  handleAddOrder: (data: OrderFormData) => void;
  handleEditOrder: (data: OrderFormData) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}

/**
 * Configuration and constants
 */
export const COLUMNS: ColumnConfig[] = [
  { key: "orderId", label: "Order ID", width: "w-[100px]" },
  { key: "itemName", label: "Item Name" },
  { key: "quantity", label: "Quantity" },
  { key: "unitPrice", label: "Unit Price" },
  { key: "subtotal", label: "Subtotal" },
  { key: "employee", label: "Employee" },
  { key: "userName", label: "User Name" },
  { key: "totalAmount", label: "Total Amount" },
  { key: "paymentStatus", label: "Payment Status" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  orderId: true,
  itemName: true,
  quantity: true,
  unitPrice: true,
  subtotal: true,
  employee: true,
  userName: true,
  totalAmount: true,
  paymentStatus: true,
};

export const INITIAL_FORM_DATA: OrderFormData = {
  itemName: "",
  quantity: 1,
  unitPrice: 0,
  employee: "",
  userName: "",
  paymentStatus: PaymentStatus.PENDING,
};

export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    itemName: "Product A",
    quantity: 2,
    unitPrice: 100.0,
    subtotal: 200.0,
    employee: "John Doe",
    userName: "Jane Smith",
    totalAmount: 200.0,
    paymentStatus: PaymentStatus.PENDING,
  },
  {
    id: "ORD-002",
    itemName: "Product B",
    quantity: 1,
    unitPrice: 150.0,
    subtotal: 150.0,
    employee: "Jane Smith",
    userName: "John Doe",
    totalAmount: 150.0,
    paymentStatus: PaymentStatus.PAID,
  },
];
