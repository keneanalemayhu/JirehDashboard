"use client";

import { useState, useMemo } from "react";
import {
  Employee,
  EmployeeFormData,
  SortDirection,
} from "@/types/dashboard/admin/employee";

const initialEmployees: Employee[] = [
  {
    id: "EMP-001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    position: "Senior Developer",
    isActive: true,
  },
];

export function useEmployees(defaultEmployees: Employee[] = initialEmployees) {
  // States
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [filterValue, setFilterValue] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    department: true,
    position: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredEmployees = useMemo(() => {
    const employeesToFilter = employees || [];

    const result = employeesToFilter.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(filterValue.toLowerCase()) ||
        employee.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        employee.department.toLowerCase().includes(filterValue.toLowerCase()) ||
        employee.position.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortDirection === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return 0;
      });
    }

    return result;
  }, [employees, filterValue, sortColumn, sortDirection]);

  // Pagination
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredEmployees.slice(startIndex, startIndex + pageSize);
  }, [filteredEmployees, currentPage, pageSize]);

  // Fixed handlers
  const handleSort = (column: keyof Employee) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
      if (sortDirection === null) {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddEmployee = (data: EmployeeFormData) => {
    // Generate new ID
    const newId = `EMP-${String(employees.length + 1).padStart(3, "0")}`;

    // Create new employee with all fields
    const newEmployee: Employee = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      department: data.department,
      position: data.position,
      isActive: data.isActive,
    };

    // Update employees
    setEmployees((prev) => [...prev, newEmployee]);
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (data: EmployeeFormData) => {
    if (!editingEmployee) return;

    // Update employees with edited data
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingEmployee.id
          ? {
              ...employee,
              ...data,
            }
          : employee
      )
    );

    // Reset states
    setIsEditDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (!editingEmployee) return;

    // Remove the employee
    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== editingEmployee.id)
    );

    // Reset states
    setIsDeleteDialogOpen(false);
    setEditingEmployee(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  return {
    // Data
    employees,
    paginatedEmployees,
    filteredEmployees,
    editingEmployee,

    // State setters
    setEmployees,
    setEditingEmployee,

    // UI state
    filterValue,
    setFilterValue,
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
    handleSort,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handlePageChange,
    handlePageSizeChange,
  };
}
