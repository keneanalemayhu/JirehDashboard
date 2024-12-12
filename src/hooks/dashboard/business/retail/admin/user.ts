"use client";

import { useState, useMemo } from "react";
import {
  User,
  UserFormData,
  SortDirection,
  Role,
} from "@/types/dashboard/business/retail/admin/user";

const initialUsers: User[] = [
  {
    id: "USR-001",
    username: "abebe.kebede",
    name: "Abebe Kebede",
    email: "abebe@example.com",
    phone: "+251-91-112-1314",
    location: "Location 1",
    role: Role.ADMIN,
    isActive: true,
  },
  {
    id: "USR-002",
    username: "teodros.alemayehu",
    name: "Teodros Alemayehu",
    email: "teodros@example.com",
    phone: "+251-92-223-2425",
    location: "Location 2",
    role: Role.ADMIN,
    isActive: true,
  },
  {
    id: "USR-003",
    username: "kalkidan.gebreselassie",
    name: "Kalkidan Gebreslassie",
    email: "kalkidan@example.com",
    phone: "+251-93-334-3536",
    location: "Location 3",
    role: Role.SALES,
    isActive: true,
  },
  {
    id: "USR-004",
    username: "bereket.tesfaye",
    name: "Bereket Tesfaye",
    email: "bereket@example.com",
    phone: "+251-94-445-4647",
    location: "Location 1",
    role: Role.WAREHOUSE,
    isActive: false,
  },
  {
    id: "USR-005",
    username: "meseret.haile",
    name: "Meseret Haile",
    email: "meseret@example.com",
    phone: "+251-95-556-5758",
    location: "Location 2",
    role: Role.SALES,
    isActive: true,
  },
  {
    id: "USR-006",
    username: "senal.teferi",
    name: "Senal Teferi",
    email: "senal@example.com",
    phone: "+251-96-667-6869",
    location: "Location 3",
    role: Role.ADMIN,
    isActive: false,
  },
  {
    id: "USR-007",
    username: "fitsum.worku",
    name: "Fitsum Worku",
    email: "fitsum@example.com",
    phone: "+251-97-778-7980",
    location: "Location 1",
    role: Role.SALES,
    isActive: true,
  },
  {
    id: "USR-008",
    username: "helen.berhane",
    name: "Helen Berhane",
    email: "helen@example.com",
    phone: "+251-98-889-9091",
    location: "Location 2",
    role: Role.WAREHOUSE,
    isActive: false,
  },
  {
    id: "USR-009",
    username: "yonas.mehari",
    name: "Yonas Mehari",
    email: "yonas@example.com",
    phone: "+251-91-123-4567",
    location: "Location 3",
    role: Role.ADMIN,
    isActive: true,
  },
  {
    id: "USR-010",
    username: "zewditu.abebe",
    name: "Zewditu Abebe",
    email: "zewditu@example.com",
    phone: "+251-92-456-7890",
    location: "Location 1",
    role: Role.WAREHOUSE,
    isActive: true,
  },
];

export function useUsers(defaultUsers: User[] = initialUsers) {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [filterValue, setFilterValue] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    username: true,
    name: true,
    email: true,
    phone: true,
    location: true,
    role: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const usersToFilter = users || [];
    const searchTerm = filterValue.toLowerCase();

    const result = usersToFilter.filter((user) => {
      const searchableFields = [
        user.username || "",
        user.name || "",
        user.email || "",
        user.phone || "",
        user.location || "",
        user.role || "",
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm)
      );
    });

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        const aString = String(aValue || "");
        const bString = String(bValue || "");

        if (sortDirection === "asc") {
          return aString.localeCompare(bString);
        } else if (sortDirection === "desc") {
          return bString.localeCompare(aString);
        }
        return 0;
      });
    }

    return result;
  }, [users, filterValue, sortColumn, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
      if (sortDirection === null) {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddUser = (data: UserFormData) => {
    const newId = `USR-${String(users.length + 1).padStart(3, "0")}`;
    const newUser: User = {
      id: newId,
      ...data,
    };
    setUsers((prev) => [...prev, newUser]);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (data: UserFormData) => {
    if (!editingUser) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === editingUser.id ? { ...user, ...data } : user
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
    users,
    paginatedUsers,
    filteredUsers,
    editingUser,
    setUsers,
    setEditingUser,
    filterValue,
    setFilterValue,
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
    sortColumn,
    sortDirection,
    handleSort,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handlePageChange,
    handlePageSizeChange,
  };
}
