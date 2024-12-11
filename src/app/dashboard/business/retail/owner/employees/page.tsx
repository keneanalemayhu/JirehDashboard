"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { EmployeeTable } from "@/components/dashboard/business/retail/owner/employees/EmployeeTable";
import { EmployeeTableSettings } from "@/components/dashboard/business/retail/owner/employees/EmployeeTableSettings";
import { EmployeeTablePagination } from "@/components/dashboard/business/retail/owner/employees/EmployeeTablePagination";
import { EmployeeForm } from "@/components/dashboard/business/retail/owner/employees/EmployeeForm";
import { useEmployees } from "@/hooks/dashboard/business/retail/owner/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Employee,
  EmployeeFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/employee";

export default function EmployeesPage() {
  const {
    employees,
    filterValue,
    setFilterValue,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
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
  } = useEmployees();

  // Calculate total employees
  const totalEmployees = employees?.length || 0;

  const handleEditSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      handleEditEmployee({
        ...data,
        id: editingEmployee.id,
      });
    }
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Employees</h1>
              <p className="text-sm text-gray-500">
                Total employees: {totalEmployees}
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CirclePlus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new employee.
                  </DialogDescription>
                </DialogHeader>
                <EmployeeForm onSubmit={handleAddEmployee} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter employees..."
              className="max-w-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <EmployeeTableSettings
              columnsVisible={columnsVisible as ColumnVisibility}
              onColumnVisibilityChange={(
                column: keyof ColumnVisibility,
                visible: boolean
              ) =>
                setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
              }
            />
          </div>

          {/* Table */}
          <EmployeeTable
            employees={filteredEmployees ?? []}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(employee: Employee) => {
              setEditingEmployee({
                ...employee,
                isActive: employee.isActive ?? true,
              });
              setIsEditDialogOpen(true);
            }}
            onDelete={(employee: Employee) => {
              setEditingEmployee({
                ...employee,
                isActive: employee.isActive ?? true,
              });
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingEmployee={editingEmployee}
            onEditSubmit={handleEditSubmit}
            onDeleteConfirm={handleDeleteEmployee}
          />

          {/* Pagination */}
          <EmployeeTablePagination
            totalItems={filteredEmployees?.length ?? 0}
            pageSize={10}
            currentPage={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}