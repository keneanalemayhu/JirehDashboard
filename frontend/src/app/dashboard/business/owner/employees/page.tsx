"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { EmployeeTable } from "@/components/dashboard/business/owner/employees/EmployeeTable";
import { EmployeeTableSettings } from "@/components/dashboard/business/owner/employees/EmployeeTableSettings";
import { EmployeeTablePagination } from "@/components/dashboard/business/owner/employees/EmployeeTablePagination";
import { EmployeeForm } from "@/components/dashboard/business/owner/employees/EmployeeForm";
import { useEmployees } from "@/hooks/dashboard/business/employee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Download, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// In EmployeesPage.tsx, update these imports
import { Employee } from "@/types/dashboard/business/employee";

export default function EmployeesPage() {
  const {
    employees,
    filteredEmployees,
    editingEmployee,
    filters,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    handleFilterChange,
    handleSort,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handlePageChange,
    handlePageSizeChange,
    setEditingEmployee,
    getLocationName,
    locations,
  } = useEmployees();

  // Handle CSV Export
  const handleExport = () => {
    const headers = [
      "ID",
      "Location",
      "Name",
      "Email",
      "Phone",
      "Position",
      "Salary",
      "Status",
      "Employment Status",
      "Hire Date",
      "Active",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map((employee) =>
        [
          employee.id,
          `"${getLocationName(employee.locationId)}"`,
          `"${employee.name}"`,
          `"${employee.email}"`,
          `"${employee.phone}"`,
          `"${employee.position}"`,
          employee.salary,
          `"${employee.status}"`,
          `"${employee.employmentStatus}"`,
          new Date(employee.hireDate).toISOString().split("T")[0],
          employee.isActive ? "Yes" : "No",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `employees-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                Manage your employees and staff members
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export to CSV"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Fill in the employee details below
                    </DialogDescription>
                  </DialogHeader>
                  <EmployeeForm
                    onSubmit={handleAddEmployee}
                    locations={locations}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filters and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="pl-8"
                />
              </div>
              <EmployeeTableSettings
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible({ ...columnsVisible, [column]: visible })
                }
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredEmployees.length} employee(s)
            </div>
          </div>

          {/* Table */}
          <EmployeeTable
            employees={employees}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(employee: Employee) => {
              setEditingEmployee(employee);
              setIsEditDialogOpen(true);
            }}
            onDelete={(employee: Employee) => {
              setEditingEmployee(employee);
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingEmployee={editingEmployee}
            onEditSubmit={handleEditEmployee}
            onDeleteConfirm={handleDeleteEmployee}
            getLocationName={getLocationName}
            locations={locations} // Add this prop
          />

          {/* Pagination */}
          <EmployeeTablePagination
            totalItems={filteredEmployees.length}
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
