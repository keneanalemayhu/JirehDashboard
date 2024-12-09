// src/types/dashboard/owner/location.ts

/**
 * Core entity interfaces
 */
export interface Location {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  isHidden: boolean;
}

/**
 * Form-related types
 */
export type LocationFormData = Omit<Location, "id">;

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
  phoneNumber: boolean;
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
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export interface LocationTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Location) => void;
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
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "name", label: "Name" },
  { key: "address", label: "Address" },
  { key: "phoneNumber", label: "Phone Number" },
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
  phoneNumber: true,
};

export const INITIAL_FORM_DATA: LocationFormData = {
  name: "",
  address: "",
  phoneNumber: "",
  isHidden: false,
};

export const initialLocations: Location[] = [
  {
    id: "LOC-001",
    name: "Main Branch",
    address: "123 Main St, City",
    phoneNumber: "+251-93-560-9939",
    isHidden: false,
  },
  {
    id: "LOC-002",
    name: "Downtown Branch",
    address: "456 Downtown Ave, City",
    phoneNumber: "+251-91-234-5678",
    isHidden: false,
  },
];
