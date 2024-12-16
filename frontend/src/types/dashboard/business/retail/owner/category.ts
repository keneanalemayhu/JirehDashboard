// src/types/dashboard/owner/category.ts

/**
 * Core entity interfaces
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  location: string;
  isHidden: boolean;
}

/**
 * Form-related types
 */
export type CategoryFormData = Omit<Category, "id">;

export interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => void;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  name: boolean;
  description: boolean;
  location: boolean;
}

export interface CategoryTableProps {
  categories: Category[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingCategory: Category | null;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export interface CategoryTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Category) => void;
}

export interface CategoryTableRowProps {
  category: Category;
  columnsVisible: ColumnVisibility;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export interface CategoryTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface CategoryTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (
    column: keyof Omit<Category, "isHidden">,
    visible: boolean
  ) => void;
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Omit<Category, "isHidden">;

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "location", label: "Location" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const locations = ["Location 1", "Location 2", "Location 3"] as const;

export type LocationType = (typeof locations)[number];

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  name: true,
  description: true,
  location: true,
};

export const INITIAL_FORM_DATA: CategoryFormData = {
  name: "",
  description: "",
  location: "",
  isHidden: false,
};

export const initialCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Category 1",
    description: "Description for category 1",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-002",
    name: "Category 2",
    description: "Description for category 2",
    location: "Location 2",
    isHidden: false,
  },
  // Add more initial categories as needed
];

/**
 * Hook return type
 */
export interface UseCategoriesReturn {
  // Data
  categories: Category[];
  paginatedCategories: Category[];
  filteredCategories: Category[];
  editingCategory: Category | null;

  // State setters
  setCategories: (categories: Category[]) => void;
  setEditingCategory: (category: Category | null) => void;

  // UI state
  filterValue: string;
  setFilterValue: (value: string) => void;
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
  handleSort: (column: keyof Category) => void;
  handleAddCategory: (data: CategoryFormData) => void;
  handleEditCategory: (data: CategoryFormData) => void;
  handleDeleteCategory: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
