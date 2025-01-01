// src/types/dashboard/business/owner/category.ts

/**
 * Core entity interfaces
 */
export interface Category {
  id: number;
  locationId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Form-related types
 */
export type CategoryFormData = Omit<Category, "id" | "createdAt" | "updatedAt">;

export interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => void;
  locations: Array<{ id: number; name: string }>;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  locationId: boolean;
  name: boolean;
  description: boolean;
  isActive: boolean;
  isHidden: boolean;
  createdAt: boolean;
  updatedAt: boolean;
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
  onEditSubmit: (data: CategoryFormData) => void;
  onDeleteConfirm: () => void;
  getLocationName: (id: number) => string;
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
  getLocationName: (id: number) => string;
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
  onColumnVisibilityChange: (column: keyof Category, visible: boolean) => void;
}

/**
 * Filter Interfaces
 */
export interface CategoryFilters {
  search: string;
  locationId: number | null;
  isActive: boolean | null;
  isHidden: boolean | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Category;

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width: string;
  sortable: boolean;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "locationId", label: "Location", width: "w-[150px]", sortable: true },
  { key: "name", label: "Name", width: "w-[200px]", sortable: true },
  {
    key: "description",
    label: "Description",
    width: "w-[300px]",
    sortable: true,
  },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: true },
  { key: "createdAt", label: "Created At", width: "w-[150px]", sortable: true },
  { key: "updatedAt", label: "Updated At", width: "w-[150px]", sortable: true },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  locationId: true,
  name: true,
  description: true,
  isActive: true,
  isHidden: false,
  createdAt: true,
  updatedAt: true,
};

export const DEFAULT_CATEGORY: CategoryFormData = {
  locationId: 0,
  name: "",
  description: "",
  isActive: true,
  isHidden: false,
};

/**
 * Hook return type
 */
export interface UseCategoriesReturn {
  // Data
  categories: Category[];
  paginatedCategories: Category[];
  filteredCategories: Category[];
  editingCategory: Category | null;
  locations: Array<{ id: number; name: string }>;
  getLocationName: (id: number) => string;

  // State setters
  setCategories: (categories: Category[]) => void;
  setEditingCategory: (category: Category | null) => void;

  // UI state
  filters: CategoryFilters;
  setFilters: (filters: Partial<CategoryFilters>) => void;
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
  sortColumn: keyof Category | null;
  sortDirection: SortDirection;

  // Handlers
  handleFilterChange: (newFilters: Partial<CategoryFilters>) => void;
  handleSort: (column: keyof Category) => void;
  handleAddCategory: (data: CategoryFormData) => void;
  handleEditCategory: (data: CategoryFormData) => void;
  handleDeleteCategory: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
