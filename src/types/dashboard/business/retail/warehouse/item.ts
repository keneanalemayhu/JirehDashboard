// src/types/dashboard/warehouse/item.ts

/**
 * Core entity interfaces
 */
export interface Item {
  id: string;
  name: string;
  price: string;
  category: string;
  isHidden: boolean;
}

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
  price: boolean;
  category: boolean;
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

export type ColumnKey = keyof Omit<Item, "isHidden">;

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "category", label: "Category" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const categories = ["Category 1", "Category 2", "Category 3"] as const;

export type CategoryType = (typeof categories)[number];

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  name: true,
  price: true,
  category: true,
};

export const INITIAL_FORM_DATA: ItemFormData = {
  name: "",
  price: "",
  category: "",
  isHidden: false,
};

export const initialItems: Item[] = [
  {
    id: "ITEM-001",
    name: "Item 1",
    price: "9.99",
    category: "Category 1",
    isHidden: false,
  },
  {
    id: "ITEM-002",
    name: "Item 2",
    price: "19.99",
    category: "Category 2",
    isHidden: false,
  },
];

export interface UseItemsReturn {
  items: Item[];
  paginatedItems: Item[];
  filteredItems: Item[];
  editingItem: Item | null;
  setItems: (items: Item[]) => void;
  setEditingItem: (item: Item | null) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  columnsVisible: ColumnVisibility;
  setColumnsVisible: (visibility: ColumnVisibility) => void;
  pageSize: number;
  currentPage: number;
  handleSort: (column: keyof Item) => void;
  handleAddItem: (data: ItemFormData) => void;
  handleEditItem: (data: ItemFormData) => void;
  handleDeleteItem: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
