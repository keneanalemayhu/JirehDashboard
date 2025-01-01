"use client";

import { useState, useEffect } from "react";
import { Employee, EmployeeFormData } from "@/types/dashboard/business/employee";
import { employeeApi } from "@/lib/api/employee";
import { useOwnerStore } from "./store";
import { toast } from "sonner";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    fullName: true,
    position: true,
    phone: true,
    email: true,
    hireDate: true,
    isActive: true,
    salary: true,
    employmentStatus: true,
    updatedAt: true,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  } | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { store, isLoading: isLoadingStore } = useOwnerStore();

  // Load employees
  useEffect(() => {
    if (store) {
      loadEmployees();
    }
  }, [store]);

  const loadEmployees = async () => {
    if (!store) {
      toast.error("No store found. Please contact support.");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await employeeApi.getEmployees(store.id);
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employees:", err);
      toast.error("Failed to load employees. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add employee
  const handleAddEmployee = async (data: EmployeeFormData) => {
    if (!store) {
      toast.error("No store found. Please contact support.");
      return;
    }

    setIsLoading(true);
    try {
      const employee = await employeeApi.createEmployee(store.id, data);
      setEmployees(prev => [...prev, employee]);
      setIsAddDialogOpen(false);
      toast.success("Employee created successfully!");
    } catch (err: any) {
      console.error("Error creating employee:", err);
      toast.error(err.response?.data?.errors || "Failed to create employee");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit employee
  const handleEditEmployee = async (data: EmployeeFormData) => {
    if (!store || !editingEmployee) return;

    setIsLoading(true);
    try {
      const updatedEmployee = await employeeApi.updateEmployee(
        store.id,
        editingEmployee.id,
        data
      );
      setEmployees(prev =>
        prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
      );
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      toast.success("Employee updated successfully!");
    } catch (err: any) {
      console.error("Error updating employee:", err);
      toast.error(err.response?.data?.errors || "Failed to update employee");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete employee
  const handleDeleteClick = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!store || !deletingEmployee) return;

    setIsLoading(true);
    try {
      await employeeApi.deleteEmployee(store.id, deletingEmployee.id);
      setEmployees(prev => prev.filter(emp => emp.id !== deletingEmployee.id));
      setIsDeleteDialogOpen(false);
      setDeletingEmployee(null);
      toast.success("Employee deleted successfully!");
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Failed to delete employee");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort
  const handleSort = (key: keyof Employee) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  // Filter and sort employees
  const filteredEmployees = employees
    .filter(employee => {
      if (!filterValue) return true;
      const searchValue = filterValue.toLowerCase();
      return (
        employee.fullName.toLowerCase().includes(searchValue) ||
        employee.position.toLowerCase().includes(searchValue) ||
        employee.email.toLowerCase().includes(searchValue) ||
        employee.phone.toLowerCase().includes(searchValue) ||
        employee.employmentStatus.toLowerCase().includes(searchValue)
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

  return {
    employees,
    filterValue,
    setFilterValue,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteClick,
    handleDeleteConfirm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingEmployee,
    setEditingEmployee,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredEmployees,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isLoading: isLoading || isLoadingStore,
    store,
  };
}
