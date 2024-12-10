// src/types/dashboard/admin/employee.ts

/**
 * Core entity interfaces
 */
export interface Employee {
  id: string;
  name: string;
  phone: string;
  salary: number;
  status: EmployeeStatus;
  location: string;
  isActive: boolean;
}

// Added helpful enums for employee status
export enum EmployeeStatus {
  FULL_TIME = "Full Time",
  PART_TIME = "Part Time",
  CONTRACT = "Contract",
  INTERN = "Intern",
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
  name: boolean;
  phone: boolean;
  salary: boolean;
  status: boolean;
  location: boolean;
}

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
}

export type ColumnKey = keyof Omit<Employee, "isActive">;

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
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "salary", label: "Salary" },
  { key: "status", label: "Status" },
  { key: "location", label: "Location" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

// Updated locations to be more comprehensive
export const locations = ["Location 1", "Location 2", "Location 3"] as const;

export type LocationType = (typeof locations)[number];

/**
 * Initial/Default Values
 */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  name: true,
  phone: true,
  salary: true,
  status: true,
  location: true,
};

export const INITIAL_FORM_DATA: EmployeeFormData = {
  name: "",
  phone: "",
  salary: 0,
  status: EmployeeStatus.FULL_TIME,
  location: "",
  isActive: true,
};

export const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    salary: 75000,
    status: EmployeeStatus.FULL_TIME,
    location: "New York",
    isActive: true,
  },
  {
    id: "EMP-002",
    name: "Jane Smith",
    phone: "+1 (555) 987-6543",
    salary: 82000,
    status: EmployeeStatus.FULL_TIME,
    location: "Remote",
    isActive: true,
  },
];
