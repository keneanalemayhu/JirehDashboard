// src/types/dashboard/business/owner/expense.ts

/**
 * Constants
 */
export const PAYMENT_METHODS = [
  "Cash",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Check",
  "Mobile Payment",
  "Other",
] as const;

export const RECURRING_FREQUENCIES = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;

/**
 * Derived types from constants
 */
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type RecurringFrequency = (typeof RECURRING_FREQUENCIES)[number];
export type SortDirection = "asc" | "desc" | null;

/**
 * Core entity interfaces based on DB schema
 */
export interface Expense {
  id: number;
  businessId: number;
  locationId: number;
  name: string;
  amount: number;
  description?: string;
  expenseDate: Date;
  paymentMethod: PaymentMethod;
  receiptNumber?: string;
  receiptImageUrl?: string | null;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency | null;
  recurringEndDate?: Date | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
  approvalStatus: "pending";
}

/**
 * Filter and Form Interfaces
 */
export interface ExpenseFilters {
  search: string;
  locationId: number | null;
  isRecurring: boolean | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  paymentMethod: PaymentMethod | "";
  minAmount: number | null;
  maxAmount: number | null;
}

export interface ColumnVisibility {
  id: boolean;
  locationId: boolean;
  name: boolean;
  amount: boolean;
  description: boolean;
  expenseDate: boolean;
  paymentMethod: boolean;
  receiptNumber: boolean;
  isRecurring: boolean;
  recurringFrequency: boolean;
  recurringEndDate: boolean;
  recurringStatus: boolean;
  approvalStatus?: boolean;
}

/**
 * Component Props Interfaces
 */
export interface ExpenseFormData
  extends Omit<Expense, "id" | "createdAt" | "updatedAt" > {
  paymentMethod: PaymentMethod;
  recurringFrequency?: RecurringFrequency;
}

export interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  onSubmit: (data: ExpenseFormData) => void;
  locations: Array<{ id: number; name: string }>;
  activeTab?: "regular" | "recurring";
  onTabChange?: (tab: "regular" | "recurring") => void;
}

export interface ExpenseTableProps {
  expenses: Expense[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  onEditSubmit: (data: ExpenseFormData) => void;
  onDeleteConfirm: () => void;
  getLocationName: (id: number) => string;
  locations: Location[];
}

/**
 * Table Column Configuration
 */
export interface ColumnConfig {
  key: keyof ColumnVisibility;
  label: string;
  width: string;
  sortable: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export type ColumnKey = keyof ColumnVisibility;

/**
 * Default Values
 */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  locationId: true,
  name: true,
  amount: true,
  description: true,
  expenseDate: true,
  paymentMethod: true,
  receiptNumber: true,
  isRecurring: true,
  recurringFrequency: true,
  recurringEndDate: true,
  recurringStatus: true,
};

export const INITIAL_FORM_DATA: ExpenseFormData = {
  businessId: 0,
  locationId: 0,
  name: "",
  amount: 0,
  description: "",
  expenseDate: new Date(),
  paymentMethod: "Cash",
  isRecurring: false,
  createdBy: 0,
  approvalStatus: "pending"
};