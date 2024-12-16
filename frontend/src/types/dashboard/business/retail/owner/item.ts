/**
 * Core entity interfaces
 */
export interface Item {
  id: string;
  categoryId: number;
  name: string;
  price: number;
  barcode: string | null;
  quantity: number;
  lastInventoryUpdate: Date | null;
  isActive: boolean;
  isHidden: boolean;
}

/**
 * Form-related types
 */
export type ItemFormData = Omit<Item, "id" | "lastInventoryUpdate">;

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
  categoryId: boolean;
  name: boolean;
  price: boolean;
  barcode: boolean;
  quantity: boolean;
  lastInventoryUpdate: boolean;
  isActive: boolean;
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
  { key: "categoryId", label: "Category" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "barcode", label: "Barcode" },
  { key: "quantity", label: "Quantity" },
  { key: "lastInventoryUpdate", label: "Last Updated" },
  { key: "isActive", label: "Status" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  categoryId: true,
  name: true,
  price: true,
  barcode: true,
  quantity: true,
  lastInventoryUpdate: true,
  isActive: true,
};

export const INITIAL_FORM_DATA: ItemFormData = {
  categoryId: 0,
  name: "",
  price: 0,
  barcode: null,
  quantity: 0,
  isActive: true,
  isHidden: false,
};

export const initialItems: Item[] = [
  {
    id: "ITM-001",
    categoryId: 1,
    name: "Item 1",
    price: 99.99,
    barcode: "123456789",
    quantity: 100,
    lastInventoryUpdate: new Date(),
    isActive: true,
    isHidden: false,
  },
  {
    id: "ITM-002",
    categoryId: 2,
    name: "Item 2",
    price: 149.99,
    barcode: "987654321",
    quantity: 50,
    lastInventoryUpdate: new Date(),
    isActive: true,
    isHidden: false,
  },
  // Add more initial items as needed
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