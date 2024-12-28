// src/types/dashboard/business/owner/location.ts

/**
 * Core entity interfaces
 */
export interface Location {
  id: number;
  businessId: number;
  name: string;
  address: string;
  contactNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Form-related types
 */
export type LocationFormData = Omit<
  Location,
  "id" | "businessId" | "createdAt" | "updatedAt"
>;

export interface LocationFormProps {
  initialData?: Partial<Location>;
  onSubmit: (data: LocationFormData) => void;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  name: boolean;
  address: boolean;
  contactNumber: boolean;
  isActive: boolean;
  updatedAt: boolean;
}

export interface LocationTableProps {
  locations: Location[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingLocation: Location | null;
  onEditSubmit: (data: LocationFormData) => void;
  onDeleteConfirm: () => void;
}

export interface LocationTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Location) => void;
  sortColumn?: keyof Location | null;
  sortDirection?: SortDirection;
}

export interface LocationTableRowProps {
  location: Location;
  columnsVisible: ColumnVisibility;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export interface LocationTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface LocationTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: keyof Location, visible: boolean) => void;
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Location;

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
  sortable?: boolean;
  align?: string;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "address", label: "Address", sortable: true },
  { key: "contactNumber", label: "Contact Number", sortable: true },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: false },
  {
    key: "updatedAt",
    label: "Last Updated",
    width: "w-[150px]",
    sortable: true,
  },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  name: true,
  address: true,
  contactNumber: true,
  isActive: true,
  updatedAt: true,
};

export const INITIAL_FORM_DATA: LocationFormData = {
  name: "",
  address: "",
  contactNumber: "",
  isActive: true,
};

/**
 * Hook return type
 */
export interface UseLocationsReturn {
  // Data
  locations: Location[];
  paginatedLocations: Location[];
  filteredLocations: Location[];
  editingLocation: Location | null;

  // State setters
  setLocations: (locations: Location[]) => void;
  setEditingLocation: (location: Location | null) => void;

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
  sortColumn: keyof Location | null;
  sortDirection: SortDirection;

  // Utility functions
  getLocationName: (locationId: number) => string;

  // Handlers
  handleSort: (column: keyof Location) => void;
  handleAddLocation: (data: LocationFormData) => void;
  handleEditLocation: (data: LocationFormData) => void;
  handleDeleteLocation: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}