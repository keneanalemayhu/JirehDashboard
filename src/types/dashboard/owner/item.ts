// src/types/dashboard/owner/item.ts

/**
 * Core entity interfaces
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  isHidden: boolean;
}

/**
 * Form-related types
 */
export type ItemFormData = Omit<Item, "id">;

export interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: ItemFormData) => void;
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

export interface ItemTableProps {
  items: Item[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingItem: Item | null;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export interface ItemTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Item) => void;
}

export interface ItemTableRowProps {
  item: Item;
  columnsVisible: ColumnVisibility;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export interface ItemTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface ItemTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (
    column: keyof Omit<Item, "isHidden">,
    visible: boolean
  ) => void;
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Omit<Item, "isHidden">;

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

export const INITIAL_FORM_DATA: ItemFormData = {
  name: "",
  description: "",
  location: "",
  isHidden: false,
};

export const initialItems: Item[] = [
  {
    id: "CAT-001",
    name: "Item 1",
    description: "Description for item 1",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-002",
    name: "Item 2",
    description: "Description for item 2",
    location: "Location 2",
    isHidden: false,
  },
  // Add more initial Items as needed
];

/**
 * Hook return type
 */
export interface UseItemsReturn {
  // Data
  items: Item[];
  paginatedItems: Item[];
  filteredItems: Item[];
  editingItem: Item | null;

  // State setters
  setItems: (items: Item[]) => void;
  setEditingItem: (item: Item | null) => void;

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
  handleSort: (column: keyof Item) => void;
  handleAddItem: (data: ItemFormData) => void;
  handleEditItem: (data: ItemFormData) => void;
  handleDeleteItem: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
