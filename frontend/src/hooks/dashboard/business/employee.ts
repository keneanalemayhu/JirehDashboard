"use client";

import { useState, useMemo } from "react";
import {
  Employee,
  EmployeeFormData,
  SortDirection,
} from "@/types/dashboard/business/admin/employee";

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "John Doe",
    phone: "+251-91-112-1314",
    salary: 75000,
    status: "Full Time",
    location: "Location 1",
    isActive: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+251-92-223-2425",
    salary: 60000,
    status: "Part Time",
    location: "Location 2",
    isActive: false,
  },
  {
    id: "3",
    name: "Michael Johnson",
    phone: "+251-93-334-3536",
    salary: 80000,
    status: "Contract",
    location: "Location 3",
    isActive: true,
  },
  {
    id: "4",
    name: "Emily Brown",
    phone: "+251-94-445-4647",
    salary: 55000,
    status: "Full Time",
    location: "Location 1",
    isActive: false,
  },
  {
    id: "5",
    name: "David Lee",
    phone: "+251-95-556-5758",
    salary: 70000,
    status: "Part Time",
    location: "Location 2",
    isActive: true,
  },
  {
    id: "6",
    name: "Sarah Kim",
    phone: "+251-96-667-6869",
    salary: 90000,
    status: "Contract",
    location: "Location 3",
    isActive: false,
  },
  {
    id: "7",
    name: "Thomas Wilson",
    phone: "+251-97-778-7980",
    salary: 65000,
    status: "Full Time",
    location: "Location 1",
    isActive: true,
  },
  {
    id: "8",
    name: "Olivia Taylor",
    phone: "+251-98-889-9091",
    salary: 50000,
    status: "Part Time",
    location: "Location 2",
    isActive: false,
  },
  {
    id: "9",
    name: "Benjamin Clark",
    phone: "+251-91-123-4567",
    salary: 85000,
    status: "Contract",
    location: "Location 3",
    isActive: true,
  },
  {
    id: "EMP-010",
    name: "Sophia Harris",
    phone: "+251-92-456-7890",
    salary: 70000,
    status: "Full Time",
    location: "Location 1",
    isActive: false,
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
    name: true,
    phone: true,
    salary: true,
    status: true,
    location: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredEmployees = useMemo(() => {
    const employeesToFilter = employees || [];
    const searchTerm = filterValue.toLowerCase();

    const result = employeesToFilter.filter((employee) => {
      const searchableFields = [
        employee.name || "",
        employee.phone || "",
        employee.status || "",
        employee.location || "",
        employee.salary?.toString() || "",
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm)
      );
    });

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle number type specifically for salary
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Convert to strings for other comparisons
        const aString = String(aValue || "");
        const bString = String(bValue || "");

        if (sortDirection === "asc") {
          return aString.localeCompare(bString);
        } else if (sortDirection === "desc") {
          return bString.localeCompare(aString);
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
    const newId = `EMP-${String(employees.length + 1).padStart(3, "0")}`;
    const newEmployee: Employee = {
      id: newId,
      ...data,
    };
    setEmployees((prev) => [...prev, newEmployee]);
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingEmployee.id ? { ...employee, ...data } : employee
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
