/* eslint-disable prefer-const */
"use client";

import { useState, useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  ColumnVisibility,
  DEFAULT_COLUMN_VISIBILITY,
  SortDirection,
  EmployeeStatus,
} from "@/types/dashboard/business/employee";
import { useLocations } from "@/hooks/dashboard/business/location";

// Sample initial data
const initialEmployees: Employee[] = [
  {
    id: "1",
    businessId: 1,
    locationId: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+251912345674",
    position: "Senior Developer",
    salary: 85000,
    status: EmployeeStatus.FULL_TIME,
    employmentStatus: "Active",
    isActive: true,
    hireDate: new Date("2023-01-15"),
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    businessId: 1,
    locationId: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+251912345674",
    position: "Project Manager",
    salary: 95000,
    status: EmployeeStatus.FULL_TIME,
    employmentStatus: "Active",
    isActive: true,
    hireDate: new Date("2023-02-01"),
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2023-02-01"),
  },
  {
    id: "3",
    businessId: 1,
    locationId: 1,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+251912345674",
    position: "Junior Developer",
    salary: 65000,
    status: EmployeeStatus.PART_TIME,
    employmentStatus: "Active",
    isActive: true,
    hireDate: new Date("2023-03-15"),
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-03-15"),
  },
];

export function useEmployees(defaultEmployees: Employee[] = initialEmployees) {
  // Get locations from the useLocations hook
  const { locations, getLocationName } = useLocations();

  // State
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // UI State
  const [filters, setFilters] = useState<EmployeeFilters>({
    search: "",
    locationId: null,
    status: null,
    employmentStatus: null,
    isActive: null,
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>(
    DEFAULT_COLUMN_VISIBILITY
  );

  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Location utility
  // getLocationName is already declared in useLocations

  // Filtered & Sorted Employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm) ||
          employee.email.toLowerCase().includes(searchTerm) ||
          employee.phone.toLowerCase().includes(searchTerm) ||
          employee.position.toLowerCase().includes(searchTerm) ||
          getLocationName(employee.locationId)
            .toLowerCase()
            .includes(searchTerm)
      );
    }

    if (filters.locationId !== null) {
      result = result.filter(
        (employee) => employee.locationId === filters.locationId
      );
    }

    if (filters.status !== null) {
      result = result.filter((employee) => employee.status === filters.status);
    }

    if (filters.employmentStatus !== null) {
      result = result.filter(
        (employee) => employee.employmentStatus === filters.employmentStatus
      );
    }

    if (filters.isActive !== null) {
      result = result.filter(
        (employee) => employee.isActive === filters.isActive
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter((employee) => {
        const hireDate = new Date(employee.hireDate);
        return (
          hireDate >= filters.dateRange.start! &&
          hireDate <= filters.dateRange.end!
        );
      });
    }

    if (sortColumn) {
      result.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue instanceof Date) {
          return sortDirection === "asc"
            ? aValue.getTime() - (bValue as Date).getTime()
            : (bValue as Date).getTime() - aValue.getTime();
        }

        if (typeof aValue === "string") {
          return sortDirection === "asc"
            ? aValue.localeCompare(String(bValue))
            : String(bValue).localeCompare(aValue);
        }

        return sortDirection === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      });
    }

    return result;
  }, [employees, filters, sortColumn, sortDirection, getLocationName]);

  // Paginated Employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<EmployeeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSort = (column: keyof Employee) => {
    setSortDirection((prev) => {
      if (sortColumn !== column) return "asc";
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
    setSortColumn(column);
  };

  const handleAddEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      id: (Math.max(...employees.map((e) => Number(e.id)), 0) + 1).toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (data: EmployeeFormData) => {
    if (!editingEmployee) return;

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingEmployee.id
          ? { ...employee, ...data, updatedAt: new Date() }
          : employee
      )
    );
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (!editingEmployee) return;

    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== editingEmployee.id)
    );
    setIsDeleteDialogOpen(false);
    setEditingEmployee(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    // Data
    employees,
    paginatedEmployees,
    filteredEmployees,
    editingEmployee,
    locations, // Now coming from useLocations
    getLocationName, // Now coming from useLocations

    // State setters
    setEmployees,
    setEditingEmployee,

    // UI state
    filters,
    setFilters,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Table state
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,

    // Handlers
    handleFilterChange,
    handleSort,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handlePageChange,
    handlePageSizeChange,
  };
}
