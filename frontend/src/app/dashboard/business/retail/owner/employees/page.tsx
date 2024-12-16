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
import { CirclePlus, Download } from "lucide-react";
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
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

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

  // Calculate pagination
  const totalEmployees = filteredEmployees?.length || 0;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedEmployees =
    filteredEmployees?.slice(startIndex, endIndex) || [];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Handle edit submit
  const handleEditSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      handleEditEmployee({
        ...data,
        id: editingEmployee.id,
      });
    }
  };

  // Export employees
  const handleExport = () => {
    const headers = [
      "ID",
      "Full Name",
      "Position",
      "Phone",
      "Email",
      "Hire Date",
      "Salary",
      "Status",
      "Location",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map((employee) =>
        [
          employee.id,
          `"${employee.fullName}"`,
          `"${employee.position}"`,
          `"${employee.phone}"`,
          `"${employee.email}"`,
          employee.hireDate,
          employee.salary,
          employee.isActive ? "Active" : "Inactive",
          `"${employee.location}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `employees-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Employees Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your staff and team members
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Employees"
              >
                <Download className="h-4 w-4" />
              </Button>
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
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Filter employees..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <EmployeeTableSettings
                columnsVisible={columnsVisible as ColumnVisibility}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {totalEmployees} employees
              </div>
            </div>
          </div>

          {/* Table */}
          <EmployeeTable
            employees={paginatedEmployees}
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
            totalItems={totalEmployees}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
