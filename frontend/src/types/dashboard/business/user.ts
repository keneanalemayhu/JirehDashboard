export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  location: string;  // This will hold the location name
  location_id: string;
  role: Role;
  isActive: boolean;
}

export enum Role {
  OWNER = "owner",
  ADMIN = "admin",
  EMPLOYEE = "employee",
  WAREHOUSE_MANAGER = "warehouse_manager",
  SALES = "sales",
}

export type UserFormData = Omit<User, "id"> & {
  location_id: string;
};

export interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  username: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  location: boolean;
  role: boolean;
  isActive: boolean;
}

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
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
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export interface UserTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof User) => void;
}

export interface UserTableRowProps {
  user: User;
  columnsVisible: ColumnVisibility;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
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
  onColumnVisibilityChange: (
    column: keyof ColumnVisibility,
    visible: boolean
  ) => void;
}

export interface UseUsersReturn {
  users: User[];
  paginatedUsers: User[];
  filteredUsers: User[];
  editingUser: User | null;
  setUsers: (users: User[]) => void;
  setEditingUser: (user: User | null) => void;
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
  sortColumn: keyof User | null;
  sortDirection: SortDirection;
  handleSort: (column: keyof User) => void;
  handleAddUser: (data: UserFormData) => void;
  handleEditUser: (data: UserFormData) => void;
  handleDeleteUser: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "username", label: "Username" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "location_id", label: "Location" },
  { key: "role", label: "Role" },
  { key: "isActive", label: "Status" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const locations = ["Location 1", "Location 2", "Location 3"] as const;
export type LocationType = (typeof locations)[number];

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  username: true,
  name: true,
  email: true,
  phone: true,
  location: true,
  role: true,
  isActive: true,
};

export const INITIAL_FORM_DATA: UserFormData = {
  username: "",
  name: "",
  email: "",
  phone: "+251",
  location_id: "",
  location: "",
  role: Role.ADMIN,
  isActive: true,
};