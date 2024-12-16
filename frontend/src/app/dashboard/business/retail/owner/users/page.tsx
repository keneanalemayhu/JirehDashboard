"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { UserTable } from "@/components/dashboard/business/retail/owner/users/UserTable";
import { UserTableSettings } from "@/components/dashboard/business/retail/owner/users/UserTableSettings";
import { UserTablePagination } from "@/components/dashboard/business/retail/owner/users/UserTablePagination";
import { UserForm } from "@/components/dashboard/business/retail/owner/users/UserForm";
import { useUsers } from "@/hooks/dashboard/business/retail/owner/user";
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
  User,
  UserFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/user";

export default function UsersPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    users,
    filterValue,
    setFilterValue,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingUser,
    setEditingUser,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredUsers,
  } = useUsers();

  // Calculate pagination
  const totalUsers = filteredUsers?.length || 0;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers?.slice(startIndex, endIndex) || [];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEditSubmit = (data: UserFormData) => {
    if (editingUser) {
      handleEditUser({
        ...data,
      });
    }
  };

  // Export users
  const handleExport = () => {
    const headers = [
      "ID",
      "Full Name",
      "Username",
      "Email",
      "Phone",
      "Role",
      "Location",
      "Last Login",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          `"${user.fullName}"`,
          `"${user.userName}"`,
          `"${user.email}"`,
          `"${user.phone}"`,
          `"${user.role}"`,
          `"${user.location}"`,
          user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "",
          user.isActive ? "Active" : "Inactive",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users-export-${new Date().toISOString().split("T")[0]}.csv`
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
                Users Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your system users and access control
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Users"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new user.
                    </DialogDescription>
                  </DialogHeader>
                  <UserForm onSubmit={handleAddUser} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Filter users..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <UserTableSettings
                columnsVisible={columnsVisible as ColumnVisibility}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {totalUsers} users
              </div>
            </div>
          </div>

          {/* Table */}
          <UserTable
            users={paginatedUsers}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(user: User) => {
              setEditingUser(user);
              setIsEditDialogOpen(true);
            }}
            onDelete={(user: User) => {
              setEditingUser(user);
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingUser={editingUser}
            onEditSubmit={handleEditSubmit}
            onDeleteConfirm={handleDeleteUser}
          />

          {/* Pagination */}
          <UserTablePagination
            totalItems={totalUsers}
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
