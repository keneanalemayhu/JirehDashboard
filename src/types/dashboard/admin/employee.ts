/**
 * Core entity interfaces
 */
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
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
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  department: boolean;
  position: boolean;
}

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
    column: keyof Omit<Employee, "isActive">,
    visible: boolean
  ) => void;
}

/**
 * Configuration and constants
 */
export type ColumnKey = keyof Omit<Employee, "isActive">;

export interface ColumnConfig {
  key: ColumnKey;
  label: string;
  width?: string;
}

export const COLUMNS: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
  { key: "position", label: "Position" },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50] as const;

export const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
] as const;

export const positions = [
  "Junior",
  "Senior",
  "Lead",
  "Manager",
  "Director",
] as const;

export type DepartmentType = (typeof departments)[number];
export type PositionType = (typeof positions)[number];

/**
 * Initial/Default Values
 */
export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_COLUMN_VISIBILITY: ColumnVisibility = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  department: true,
  position: true,
};

export const INITIAL_FORM_DATA: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
  position: "",
  isActive: true,
};

export const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    position: "Senior",
    isActive: true,
  },
  {
    id: "EMP-002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    department: "Marketing",
    position: "Manager",
    isActive: true,
  },
  // Add more initial employees as needed
];

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

  // Handlers
  handleSort: (column: keyof Employee) => void;
  handleAddEmployee: (data: EmployeeFormData) => void;
  handleEditEmployee: (data: EmployeeFormData) => void;
  handleDeleteEmployee: () => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (size: number) => void;
}
