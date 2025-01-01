"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  User,
  UserFormData,
  ColumnVisibility,
  DEFAULT_COLUMN_VISIBILITY,
  SortDirection,
} from "@/types/dashboard/business/user";
import { userApi } from "@/lib/api/user";
import { toast } from "sonner";

export const useUsers = (businessId: number) => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>(DEFAULT_COLUMN_VISIBILITY);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await userApi.getUsers(businessId);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    let filtered = users;

    // Apply search filter
    if (filterValue) {
      const searchTerm = filterValue.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phone.toLowerCase().includes(searchTerm) ||
          user.location.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sortColumn && sortDirection) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        const modifier = sortDirection === "asc" ? 1 : -1;

        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
      });
    }

    return filtered;
  }, [users, filterValue, sortColumn, sortDirection]);

  // Sort handler
  const handleSort = useCallback((column: keyof User) => {
    setSortDirection((prev) => {
      if (column !== sortColumn) return "asc";
      if (prev === "asc") return "desc";
      if (prev === "desc") return null;
      return "asc";
    });
    setSortColumn(column);
  }, [sortColumn]);

  // CRUD operations
  const handleAddUser = async (data: UserFormData) => {
    try {
      const newUser = await userApi.createUser(businessId, data);
      setUsers((prev) => [...prev, newUser]);
      setIsAddDialogOpen(false);
      toast.success("User created successfully");
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("Failed to create user");
    }
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!editingUser) return;
    try {
      const updatedUser = await userApi.updateUser(businessId, editingUser.id, data);
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? updatedUser : user))
      );
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;
    try {
      await userApi.deleteUser(businessId, editingUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== editingUser.id));
      setIsDeleteDialogOpen(false);
      setEditingUser(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
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
  };
};
