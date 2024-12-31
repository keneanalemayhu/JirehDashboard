/**
 * Core entity interfaces
 */
export interface Item {
  id: string;
  businessId: number;
  name: string;
  barcode: string;
  price: string;
  quantity: number;
  categoryId: number;
  isActive: boolean;
  isHidden: boolean;
  isTemporary: boolean;
  expiryHours: number | null;
  autoResetQuantity: boolean;
  lastQuantityReset: Date | null;
  lastInventoryUpdate: Date;
}

/**
 * Form-related types
 */
export type ItemFormData = Omit<
  Item,
  "id" | "lastInventoryUpdate" | "lastQuantityReset"
>;

export interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: ItemFormData) => void;
  defaultTemporary?: boolean;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  businessId: boolean;
  categoryId: boolean;
  name: boolean;
  price: boolean;
  barcode: boolean;
  quantity: boolean;
  lastInventoryUpdate: boolean;
  lastQuantityReset: boolean;
  isActive: boolean;
  isHidden: boolean;
  isTemporary: boolean;
  expiryHours: boolean;
  autoResetQuantity: boolean;
  temporaryStatus: boolean;
}

export interface ItemTableProps {
  items: Item[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  activeTab?: "regular" | "temporary";
  onTabChange?: (tab: "regular" | "temporary") => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingItem: Item | null;
  onEditSubmit: (data: ItemFormData) => void;
  onDeleteConfirm: () => void;
  showTemporaryColumns?: boolean;
}

export interface ItemTableHeaderProps {
  columnsVisible: Record<keyof Item | "temporaryStatus", boolean>;
  onSort: (column: keyof Item) => void;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  showTemporaryColumns?: boolean;
}

export interface ItemTableRowProps {
  item: Item;
  columnsVisible: ColumnVisibility;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  temporaryStatus?: string;
}

export interface ItemTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  itemType?: "regular" | "temporary";
  totalRegularItems?: number;
  totalTemporaryItems?: number;
}

export interface ItemTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: keyof Item, visible: boolean) => void;
  showTemporaryColumns?: boolean;
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Item;

export interface ColumnConfig {
  key: keyof Item | "temporaryStatus";
  label: string;
  width?: string;
  sortable?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "businessId", label: "Business", width: "w-[100px]", sortable: true },
  { key: "categoryId", label: "Category", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "price", label: "Price", sortable: true },
  { key: "barcode", label: "Barcode", sortable: true },
  { key: "quantity", label: "Quantity", sortable: true },
  { key: "lastInventoryUpdate", label: "Last Updated", sortable: true },
  { key: "isActive", label: "Status", sortable: false },
  { key: "isHidden", label: "Visibility", sortable: false },
  { key: "isTemporary", label: "Type", sortable: false },
  { key: "expiryHours", label: "Expiry Hours", sortable: true },
  { key: "autoResetQuantity", label: "Auto Reset", sortable: false },
  { key: "temporaryStatus", label: "Time Status", sortable: true },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  businessId: false,
  categoryId: true,
  name: true,
  price: true,
  barcode: true,
  quantity: true,
  lastInventoryUpdate: true,
  lastQuantityReset: true,
  isActive: true,
  isHidden: true,
  isTemporary: true,
  expiryHours: true,
  autoResetQuantity: true,
  temporaryStatus: true,
};

export const INITIAL_FORM_DATA: ItemFormData = {
  businessId: 0,
  categoryId: 0,
  name: "",
  price: "",
  barcode: "",
  quantity: 0,
  isActive: true,
  isHidden: false,
  isTemporary: false,
  expiryHours: null,
  autoResetQuantity: false,
};

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
  activeTab: "regular" | "temporary";
  setActiveTab: (tab: "regular" | "temporary") => void;

  // Table state
  columnsVisible: ColumnVisibility;
  setColumnsVisible: (visibility: ColumnVisibility) => void;
  pageSize: number;
  currentPage: number;
  sortColumn: keyof Item | null;
  sortDirection: SortDirection;

  // Handlers
  handleSort: (column: keyof Item) => void;
  handleAddItem: (data: ItemFormData) => void;
  handleEditItem: (data: ItemFormData) => void;
  handleDeleteItem: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
  handleTabChange: (tab: "regular" | "temporary") => void;
  getTemporaryItemStatus: (item: Item) => string;
}