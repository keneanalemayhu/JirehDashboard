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
export interface ExpenseCategory {
  id: number;
  business: number;
  name: string;
  description?: string;
  is_active: boolean;
  is_recurring: boolean;
  budget_limit?: number;
  parent_category?: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: number;
  business: number;
  category: number;
  category_name: string;
  amount: number;
  description?: string;
  receipt_number?: string;
  payment_method: PaymentMethod;
  receipt_image_url?: string;
  expense_date: string;
  is_recurring: boolean;
  recurring_frequency?: RecurringFrequency;
  recurring_end_date?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Filter and Form Interfaces
 */
export interface ExpenseFilters {
  search: string;
  categoryId: number | null;
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
  category: boolean;
  amount: boolean;
  description: boolean;
  receipt_number: boolean;
  payment_method: boolean;
  receipt_image_url: boolean;
  expense_date: boolean;
  is_recurring: boolean;
  recurring_frequency: boolean;
  recurring_end_date: boolean;
}

/**
 * Component Props Interfaces
 */
export interface ExpenseFormData extends Omit<Expense, 'id' | 'business' | 'created_at' | 'updated_at' | 'category_name'> {
  category: number;
}

export interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  businessId: number;
}

export interface ExpenseTableProps {
  expenses: Expense[];
  columnsVisible: ColumnVisibility;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  getCategoryName: (id: number) => string;
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
  className?: string;
}

export type ColumnKey = keyof ColumnVisibility;

/**
 * Default Values
 */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  category: true,
  amount: true,
  description: true,
  receipt_number: true,
  payment_method: true,
  receipt_image_url: true,
  expense_date: true,
  is_recurring: true,
  recurring_frequency: true,
  recurring_end_date: true,
};