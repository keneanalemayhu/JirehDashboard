// src/types/dashboard/business/owner/user.ts

/**
 * Enums
 */
export enum Role {
  OWNER = "Owner",
  ADMIN = "Admin",
  SALES = "Sales",
  WAREHOUSE = "Warehouse",
}

/**
 * Core entity interfaces
 */
export interface User {
  id: string;
  businessId: number;
  locationId: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Form-related types
 */
export type UserFormData = Omit<
  User,
  "id" | "lastLogin" | "createdAt" | "updatedAt"
>;

export interface UserFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: UserFormData) => void;
  locations: Array<{ id: number; name: string }>;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  businessId: boolean;
  locationId: boolean;
  username: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  role: boolean;
  isActive: boolean;
  lastLogin: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
  sortable: boolean;
}

export type ColumnKey = keyof User;

export interface UserTableProps {
  users: User[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingUser: User | null;
  onEditSubmit: (data: UserFormData) => void;
  onDeleteConfirm: () => void;
  getLocationName: (id: number) => string;
}

export interface UserTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof User) => void;
  sortColumn?: keyof User | null;
  sortDirection?: SortDirection;
}

export interface UserTableRowProps {
  user: User;
  columnsVisible: ColumnVisibility;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  getLocationName: (id: number) => string;
}

export interface UserTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface UserTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: keyof User, visible: boolean) => void;
}

/**
 * Filter interfaces
 */
export interface UserFilters {
  search: string;
  locationId: number | null;
  role: Role | null;
  isActive: boolean | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "businessId", label: "Business", width: "w-[100px]", sortable: true },
  { key: "locationId", label: "Location", width: "w-[150px]", sortable: true },
  { key: "username", label: "Username", width: "w-[150px]", sortable: true },
  { key: "name", label: "Name", width: "w-[200px]", sortable: true },
  { key: "email", label: "Email", width: "w-[200px]", sortable: true },
  { key: "phone", label: "Phone", width: "w-[150px]", sortable: true },
  { key: "role", label: "Role", width: "w-[120px]", sortable: true },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: true },
  { key: "lastLogin", label: "Last Login", width: "w-[150px]", sortable: true },
  { key: "createdAt", label: "Created At", width: "w-[150px]", sortable: true },
  { key: "updatedAt", label: "Updated At", width: "w-[150px]", sortable: true },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  businessId: false,
  locationId: true,
  username: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isActive: true,
  lastLogin: false,
  createdAt: false,
  updatedAt: false,
};

export const INITIAL_FORM_DATA: UserFormData = {
  businessId: 0,
  locationId: 0,
  username: "",
  name: "",
  email: "",
  phone: "+251",
  role: Role.SALES,
  isActive: true,
};
