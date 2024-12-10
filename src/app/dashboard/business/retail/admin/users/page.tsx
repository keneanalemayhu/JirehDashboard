"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/admin/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/admin/Sidebar";
import { UserTable } from "@/components/dashboard/business/retail/admin/users/UserTable";
import { UserTableSettings } from "@/components/dashboard/business/retail/admin/users/UserTableSettings";
import { UserTablePagination } from "@/components/dashboard/business/retail/admin/users/UserTablePagination";
import { UserForm } from "@/components/dashboard/business/retail/admin/users/UserForm";
import { useUsers } from "@/hooks/dashboard/business/retail/admin/user";
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
  User,
  UserFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/admin/user";

export default function UsersPage() {
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

  const totalUsers = users?.length || 0;

  const handleEditSubmit = (data: UserFormData) => {
    if (editingUser) {
      handleEditUser({
        ...data,
      });
    }
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-sm text-gray-500">Total users: {totalUsers}</p>
            </div>
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

          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter users..."
              className="max-w-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <UserTableSettings
              columnsVisible={columnsVisible as ColumnVisibility}
              onColumnVisibilityChange={(
                column: keyof ColumnVisibility,
                visible: boolean
              ) =>
                setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
              }
            />
          </div>

          <UserTable
            users={filteredUsers ?? []}
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

          <UserTablePagination
            totalItems={filteredUsers?.length ?? 0}
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
