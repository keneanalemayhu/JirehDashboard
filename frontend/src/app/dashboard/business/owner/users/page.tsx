"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { UserTable } from "@/components/dashboard/business/owner/users/UserTable";
import { UserTableSettings } from "@/components/dashboard/business/owner/users/UserTableSettings";
import { UserTablePagination } from "@/components/dashboard/business/owner/users/UserTablePagination";
import { UserForm } from "@/components/dashboard/business/owner/users/UserForm";
import { useUsers } from "@/hooks/dashboard/business/user";
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
} from "@/types/dashboard/business/user";
import { toast } from "sonner";

export default function UsersPage() {
  // Get business ID from context or URL
  const businessId = 1; // TODO: Get business id from context or URL

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
    isLoading,
    fetchUsers,
  } = useUsers(businessId);

  // Fetch users on component mount
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      handleEditUser(data);
    }
  };

  // Export users
  const handleExport = () => {
    if (!filteredUsers || filteredUsers.length === 0) {
      toast.error("No users to export");
      return;
    }

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
          `"${user.name}"`,
          `"${user.username}"`,
          `"${user.email}"`,
          `"${user.phone}"`,
          `"${user.role}"`,
          `"${user.location_id}"`,
          `"${user.isActive ? 'Active' : 'Inactive'}"`,
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
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col h-full">
        <Header />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex items-center flex-1 space-x-2">
              <Input
                placeholder="Filter users..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <UserTableSettings
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8">
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add User</DialogTitle>
                    <DialogDescription>
                      Add a new user to your business
                    </DialogDescription>
                  </DialogHeader>
                  <UserForm onSubmit={handleAddUser} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="rounded-md border">
            <UserTable
              users={paginatedUsers}
              columnsVisible={columnsVisible}
              onSort={handleSort}
              onEdit={(user) => {
                setEditingUser(user);
                setIsEditDialogOpen(true);
              }}
              onDelete={(user) => {
                setEditingUser(user);
                setIsDeleteDialogOpen(true);
              }}
              isLoading={isLoading}
            />
          </div>
          <UserTablePagination
            totalItems={totalUsers}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange} totalPages={0}          />
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Edit user information
            </DialogDescription>
          </DialogHeader>
          <UserForm
            initialData={editingUser || undefined}
            onSubmit={handleEditSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
}
