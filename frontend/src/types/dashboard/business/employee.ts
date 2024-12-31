// src/types/dashboard/business/owner/employee.ts

import { Location as BusinessLocation } from "c:/Programming/Work/JirehDashboard/frontend/src/types/dashboard/business/location";

/**
 * Core entity interfaces
 */
export interface Employee {
  id: string;
  businessId: number;
  locationId: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  status: EmployeeStatus;
  employmentStatus: string;
  isActive: boolean;
  hireDate: Date;
  createdAt: Date;
  updatedAt: Date;
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
export type EmployeeFormData = Omit<Employee, "id" | "createdAt" | "updatedAt">;

export interface EmployeeFormProps {
  initialData?: Partial<Employee>;
  onSubmit: (data: EmployeeFormData) => void;
  locations: Array<{ id: number; name: string }>;
  sortColumn: keyof Employee | null;
  sortDirection: SortDirection;
}

/**
 * Table-related types
 */
export type SortDirection = "asc" | "desc" | null;

export interface ColumnVisibility {
  id: boolean;
  businessId: boolean;
  locationId: boolean;
  name: boolean;
  email: boolean;
  phone: boolean;
  position: boolean;
  salary: boolean;
  status: boolean;
  employmentStatus: boolean;
  isActive: boolean;
  hireDate: boolean;
  createdAt: boolean;
  updatedAt: boolean;
}

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
  sortable: boolean;
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
  onEditSubmit: (data: EmployeeFormData) => void;
  onDeleteConfirm: () => void;
  getLocationName: (id: number) => string;
  locations: BusinessLocation[];
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
  getLocationName: (id: number) => string;
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
  onColumnVisibilityChange: (column: keyof Employee, visible: boolean) => void;
}

/**
 * Filter Interfaces
 */
export interface EmployeeFilters {
  search: string;
  locationId: number | null;
  status: EmployeeStatus | null;
  employmentStatus: string | null;
  isActive: boolean | null;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

/**
 * Configuration and constants
 */
export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "locationId", label: "Location", width: "w-[150px]", sortable: true },
  { key: "name", label: "Name", width: "w-[200px]", sortable: true },
  { key: "email", label: "Email", width: "w-[200px]", sortable: true },
  { key: "phone", label: "Phone", width: "w-[150px]", sortable: true },
  { key: "position", label: "Position", width: "w-[150px]", sortable: true },
  { key: "salary", label: "Salary", width: "w-[120px]", sortable: true },
  { key: "status", label: "Status", width: "w-[120px]", sortable: true },
  {
    key: "employmentStatus",
    label: "Employment",
    width: "w-[120px]",
    sortable: true,
  },
  { key: "hireDate", label: "Hire Date", width: "w-[150px]", sortable: true },
  { key: "isActive", label: "Active", width: "w-[100px]", sortable: true },
  { key: "createdAt", label: "Created At", width: "w-[150px]", sortable: true },
  { key: "updatedAt", label: "Updated At", width: "w-[150px]", sortable: true },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

/**
 * Initial/Default Values
 */
export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  businessId: false,
  locationId: true,
  name: true,
  email: true,
  phone: true,
  position: true,
  salary: true,
  status: true,
  employmentStatus: true,
  isActive: true,
  hireDate: true,
  createdAt: false,
  updatedAt: false,
};

export const INITIAL_FORM_DATA: EmployeeFormData = {
  businessId: 0,
  locationId: 0,
  name: "",
  email: "",
  phone: "",
  position: "",
  salary: 0,
  status: EmployeeStatus.FULL_TIME,
  employmentStatus: "",
  isActive: true,
  hireDate: new Date(),
};

/**
 * Hook return type
 */
export interface UseEmployeesReturn {
  // Data
  employees: Employee[];
  paginatedEmployees: Employee[];
  filteredEmployees: Employee[];
  editingEmployee: Employee | null;
  locations: Array<{ id: number; name: string }>;
  getLocationName: (id: number) => string;

  // State setters
  setEmployees: (employees: Employee[]) => void;
  setEditingEmployee: (employee: Employee | null) => void;

  // UI state
  filters: EmployeeFilters;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
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
  handleFilterChange: (newFilters: Partial<EmployeeFilters>) => void;
  handleSort: (column: keyof Employee) => void;
  handleAddEmployee: (data: EmployeeFormData) => void;
  handleEditEmployee: (data: EmployeeFormData) => void;
  handleDeleteEmployee: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
