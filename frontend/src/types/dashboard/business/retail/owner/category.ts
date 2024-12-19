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
    description: "Gadgets, software, and digital trends",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-002",
    name: "Category 2",
    description: "Exploring the world, one destination at a time",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "CAT-003",
    name: "Category 3",
    description: "Delicious recipes and culinary adventures",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "CAT-004",
    name: "Category 4",
    description: "The latest trends in style and beauty",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-005",
    name: "Category 5",
    description: "Healthy living and workout tips",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "CAT-006",
    name: "Category 6",
    description: "Money management and investment advice",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "CAT-007",
    name: "Category 7",
    description: "The world of video games and esports",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-008",
    name: "Category 8",
    description: "Literary reviews and book recommendations",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "CAT-009",
    name: "Category 9",
    description: "Exploring the world of music, from classical to pop",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "CAT-010",
    name: "Category 10",
    description: "Appreciating the beauty of visual arts",
    location: "Location 1",
    isHidden: false,
  },
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
