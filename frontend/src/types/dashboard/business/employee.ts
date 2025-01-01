// src/types/dashboard/owner/employee.ts

/**
 * Core entity interfaces
 */
export interface Employee {
  id: number;
  storeId: number;
  locationId: number;
  fullName: string;
  position: string;
  phone: string;
  email: string;
  hireDate: string;
  isActive: boolean;
  salary: number;
  employmentStatus: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

// Added helpful enums for employee status
export enum EmployeeStatus {
  FULL_TIME = "full_time",
  PART_TIME = "part",
  CONTRACT = "contract",
  INTERN = "intern",
}

/**
 * Form-related types
 */
export type EmployeeFormData = Omit<Employee, "id">;

export interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => void;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  storeId: boolean;
  locationId: boolean;
  fullName: boolean;
  position: boolean;
  phone: boolean;
  email: boolean;
  hireDate: boolean;
  isActive: boolean;
  salary: boolean;
  employmentStatus: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
}

export type ColumnKey = keyof Employee;

export interface EmployeeTableProps {
  employees: Employee[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingEmployee: Employee | null;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export interface EmployeeTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Employee) => void;
}

export interface EmployeeTableRowProps {
  employee: Employee;
  columnsVisible: ColumnVisibility;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export interface EmployeeTablePaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export interface EmployeeTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (
    column: keyof ColumnVisibility,
    visible: boolean
  ) => void;
}

/**
 * Hook return type
 */
export interface UseEmployeesReturn {
  // Data
  employees: Employee[];
  paginatedEmployees: Employee[];
  filteredEmployees: Employee[];
  editingEmployee: Employee | null;

  // State setters
  setEmployees: (employees: Employee[]) => void;
  setEditingEmployee: (employee: Employee | null) => void;

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
  sortColumn: keyof Employee | null;
  sortDirection: SortDirection;

  // Handlers
  handleSort: (column: keyof Employee) => void;
  handleAddEmployee: (data: EmployeeFormData) => void;
  handleEditEmployee: (data: EmployeeFormData) => void;
  handleDeleteEmployee: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}

/**
 * Configuration and constants
 */
export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "storeId", label: "Store ID" },
  { key: "locationId", label: "Location ID" },
  { key: "fullName", label: "Full Name" },
  { key: "position", label: "Position" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "hireDate", label: "Hire Date" },
  { key: "isActive", label: "Is Active" },
  { key: "salary", label: "Salary" },
  { key: "employmentStatus", label: "Employment Status" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  storeId: true,
  locationId: true,
  fullName: true,
  position: true,
  phone: true,
  email: true,
  hireDate: true,
  isActive: true,
  salary: true,
  employmentStatus: true,
  createdAt: true,
  updatedAt: true,
};

export const INITIAL_FORM_DATA: EmployeeFormData = {
  fullName: "",
  position: "",
  phone: "",
  email: "",
  hireDate: "",
  isActive: true,
  salary: 0,
  employmentStatus: EmployeeStatus.FULL_TIME,
};

export const initialEmployees: Employee[] = [
  {
    id: 1,
    storeId: 1,
    locationId: 1,
    fullName: "John Doe",
    position: "Software Engineer",
    phone: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    hireDate: "2020-01-01",
    isActive: true,
    salary: 75000,
    employmentStatus: EmployeeStatus.FULL_TIME,
    createdAt: "2020-01-01T12:00:00.000Z",
    updatedAt: "2020-01-01T12:00:00.000Z",
  },
  {
    id: 2,
    storeId: 2,
    locationId: 2,
    fullName: "Jane Smith",
    position: "Software Engineer",
    phone: "+1 (555) 987-6543",
    email: "jane.smith@example.com",
    hireDate: "2020-01-01",
    isActive: true,
    salary: 82000,
    employmentStatus: EmployeeStatus.FULL_TIME,
    createdAt: "2020-01-01T12:00:00.000Z",
    updatedAt: "2020-01-01T12:00:00.000Z",
  },
];
