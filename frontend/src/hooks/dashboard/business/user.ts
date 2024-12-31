"use client";

import { useState, useMemo } from "react";
import {
  User,
  UserFormData,
  UserFilters,
  Role,
  ColumnVisibility,
  DEFAULT_COLUMN_VISIBILITY,
  SortDirection,
} from "@/types/dashboard/business/user";
import { useLocations } from "@/hooks/dashboard/business/location";
import { startOfMonth, endOfMonth } from "date-fns";

const initialUsers: User[] = [
  {
    id: "1",
    businessId: 1,
    locationId: 1,
    username: "abebe.kebede",
    name: "Abebe Kebede",
    email: "abebe@example.com",
    phone: "+251-91-112-1314",
    role: Role.OWNER,
    isActive: true,
    lastLogin: new Date("2024-03-01T10:00:00"),
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: "2",
    businessId: 1,
    locationId: 2,
    username: "teodros.alemayehu",
    name: "Teodros Alemayehu",
    email: "teodros@example.com",
    phone: "+251-92-223-2425",
    role: Role.ADMIN,
    isActive: true,
    lastLogin: new Date("2024-03-02T09:30:00"),
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-02"),
  },
];

export function useUsers(defaultUsers: User[] = initialUsers) {
  const { locations, getLocationName } = useLocations();

  // States
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    locationId: null,
    role: null,
    isActive: null,
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>(
    DEFAULT_COLUMN_VISIBILITY
  );
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Enhanced filtering with memo
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.phone.toLowerCase().includes(searchTerm) ||
          getLocationName(user.locationId).toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)
      );
    }

    // Apply other filters
    if (filters.locationId !== null) {
      result = result.filter((user) => user.locationId === filters.locationId);
    }

    if (filters.role !== null) {
      result = result.filter((user) => user.role === filters.role);
    }

    if (filters.isActive !== null) {
      result = result.filter((user) => user.isActive === filters.isActive);
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter((user) => {
        const userDate = new Date(user.createdAt);
        return (
          userDate >= filters.dateRange.start! &&
          userDate <= filters.dateRange.end!
        );
      });
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (
          sortColumn === "lastLogin" ||
          sortColumn === "createdAt" ||
          sortColumn === "updatedAt"
        ) {
          const aDate = aValue as Date | null;
          const bDate = bValue as Date | null;

          // Handle null dates
          if (!aDate && !bDate) return 0;
          if (!aDate) return sortDirection === "asc" ? 1 : -1;
          if (!bDate) return sortDirection === "asc" ? -1 : 1;

          return sortDirection === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === "boolean") {
          return sortDirection === "asc" ? (aValue ? 1 : -1) : aValue ? -1 : 1;
        }

        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return result;
  }, [users, filters, sortColumn, sortDirection, getLocationName]);

  // Pagination with memo
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddUser = (data: UserFormData) => {
    const newId = `USR${String(users.length + 1).padStart(3, "0")}`;
    const newUser: User = {
      id: newId,
      ...data,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUsers((prev) => [...prev, newUser]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (data: UserFormData) => {
    if (!editingUser) return;

    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              ...data,
              updatedAt: new Date(),
            }
          : user
      )
    );

    setIsEditDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    if (!editingUser) return;

    setUsers((prev) => prev.filter((user) => user.id !== editingUser.id));
    setIsDeleteDialogOpen(false);
    setEditingUser(null);
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
    users,
    paginatedUsers,
    filteredUsers,
    editingUser,
    locations,
    getLocationName,

    // State setters
    setUsers,
    setEditingUser,

    // UI state
    filters,
    setFilters,
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
    handleFilterChange,
    handleSort,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handlePageChange,
    handlePageSizeChange,
  };
}
