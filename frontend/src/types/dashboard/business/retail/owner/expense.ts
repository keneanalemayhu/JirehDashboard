// src/types/dashboard/owner/expense.ts

/**
 * Core entity interfaces
 */
export type FrequencyType =
  | "One-time"
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Yearly";

export interface Expense {
  id: number;
  name: string;
  amount: number;
  location: string;
  expenseDate: string;
  frequency: FrequencyType;
}

/**
 * Form-related types
 */
export type ExpenseFormData = Omit<Expense, "id">;

export interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  onSubmit: (data: ExpenseFormData) => void;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  name: boolean;
  amount: boolean;
  location: boolean;
  expenseDate: boolean;
  frequency: boolean;
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
  filterFrequency: FrequencyType | "";
  onFrequencyFilterChange: (frequency: FrequencyType | "") => void;
}

export interface ExpenseTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Expense) => void;
}

export interface ExpenseTableRowProps {
  expense: Expense;
  columnsVisible: ColumnVisibility;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export interface ExpenseTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface ExpenseTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: keyof Expense, visible: boolean) => void;
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Expense;

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
  align?: string;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "name", label: "Name" },
  { key: "amount", label: "Amount", width: "w-[150px]", align: "text-right" },
  { key: "location", label: "Location" },
  { key: "expenseDate", label: "Date", width: "w-[150px]" },
  { key: "frequency", label: "Frequency", width: "w-[150px]" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const locations = ["Location 1", "Location 2", "Location 3"] as const;

export type LocationType = (typeof locations)[number];

export const frequencies: FrequencyType[] = [
  "One-time",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
];

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  name: true,
  amount: true,
  location: true,
  expenseDate: true,
  frequency: true,
};

export const INITIAL_FORM_DATA: ExpenseFormData = {
  name: "",
  amount: 0,
  location: "",
  expenseDate: new Date().toISOString().split("T")[0],
  frequency: "One-time",
};

export const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Office Supplies",
    amount: 150.75,
    location: "Location 1",
    expenseDate: "2024-03-15",
    frequency: "Monthly",
  },
  {
    id: 2,
    name: "Equipment Maintenance",
    amount: 450.0,
    location: "Location 2",
    expenseDate: "2024-03-14",
    frequency: "Quarterly",
  },
  // Add more initial expenses as needed
];

/**
 * Hook return type
 */
export interface UseExpensesReturn {
  // Data
  expenses: Expense[];
  paginatedExpenses: Expense[];
  filteredExpenses: Expense[];
  editingExpense: Expense | null;
  expenseTotalsByFrequency: Record<FrequencyType, number>;

  // State setters
  setExpenses: (expenses: Expense[]) => void;
  setEditingExpense: (expense: Expense | null) => void;

  // UI state
  filterValue: string;
  setFilterValue: (value: string) => void;
  filterFrequency: FrequencyType | "";
  setFilterFrequency: (frequency: FrequencyType | "") => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;

  // Table state
  columnsVisible: ColumnVisibility;
  setColumnsVisible: (visibility: ColumnVisibility) => void;
  pageSize: number;
  currentPage: number;

  // Handlers
  handleSort: (column: keyof Expense) => void;
  handleAddExpense: (data: ExpenseFormData) => void;
  handleEditExpense: (data: Expense) => void;
  handleDeleteExpense: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
