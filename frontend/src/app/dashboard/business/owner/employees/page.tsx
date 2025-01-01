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
} from "@/types/dashboard/business/employee";

export default function EmployeesPage() {
  const {
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
    isLoading,
  } = useEmployees();

  const handleEditSubmit = async (data: EmployeeFormData) => {
    await handleEditEmployee(data);
  };

  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Name", "Position", "Phone", "Email", "Hire Date", "Status", "Salary", "Employment Status", "Last Updated"];
    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map((employee) =>
        [
          employee.fullName,
          employee.position,
          employee.phone,
          employee.email,
          employee.hireDate,
          employee.isActive ? "Active" : "Inactive",
          employee.salary,
          employee.employmentStatus,
          new Date(employee.updatedAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "employees.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Employees</h2>
            <p className="text-sm text-muted-foreground">
              Manage your business employees here
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={exportToCSV}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <CirclePlus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                  <DialogDescription>
                    Add a new employee to your business
                  </DialogDescription>
                </DialogHeader>
                <EmployeeForm onSubmit={handleAddEmployee} isLoading={isLoading} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Filter employees..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <EmployeeTableSettings
            columnsVisible={columnsVisible}
            setColumnsVisible={setColumnsVisible}
          />
        </div>

        <div className="space-y-4">
          <EmployeeTable
            employees={filteredEmployees}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(employee) => {
              setEditingEmployee(employee);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteClick}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingEmployee={editingEmployee}
            onEditSubmit={handleEditSubmit}
            onDeleteConfirm={handleDeleteConfirm}
          />

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <strong>
                {Math.min((currentPage - 1) * pageSize + 1, filteredEmployees.length)}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * pageSize, filteredEmployees.length)}
              </strong>{" "}
              of <strong>{filteredEmployees.length}</strong> employees
            </p>
            <EmployeeTablePagination
              totalItems={filteredEmployees.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
