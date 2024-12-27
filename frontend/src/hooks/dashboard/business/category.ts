"use client";

import { useState, useMemo } from "react";
import {
  Category,
  CategoryFormData,
  SortDirection,
} from "@/types/dashboard/business/category";

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Category-1",
    description: "Electronic devices and gadgets",
    location: "Main Store",
    isActive: true,
    isHidden: false,
    lastUpdated: new Date("2024-03-01").toISOString(),
  },
  {
    id: 2,
    name: "Category-2",
    description: "Fashion and apparel",
    location: "Main Store",
    isActive: true,
    isHidden: false,
    lastUpdated: new Date("2024-03-01").toISOString(),
  },
  {
    id: 3,
    name: "Category-3",
    description: "Household items and appliances",
    location: "Main Store",
    isActive: true,
    isHidden: false,
    lastUpdated: new Date("2024-03-01").toISOString(),
  },
];

export function useCategories(
  defaultCategories: Category[] = initialCategories
) {
  // States
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [filterValue, setFilterValue] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    description: true,
    location: true,
    isActive: true,
    isHidden: true,
    lastUpdated: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Category | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredCategories = useMemo(() => {
    const categoriesToFilter = categories || [];

    const result = categoriesToFilter.filter(
      (category) =>
        category.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        category.description
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        category.location.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else if (sortDirection === "desc") {
          return String(bValue).localeCompare(String(aValue));
        }
        return 0;
      });
    }

    return result;
  }, [categories, filterValue, sortColumn, sortDirection]);

  // Pagination
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCategories.slice(startIndex, startIndex + pageSize);
  }, [filteredCategories, currentPage, pageSize]);

  // Handlers
  const handleSort = (column: keyof Category) => {
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

  const handleAddCategory = (data: CategoryFormData) => {
    const maxId = Math.max(...categories.map((c) => c.id), 0);
    const newId = maxId + 1;

    const newCategory: Category = {
      id: newId,
      name: data.name,
      description: data.description,
      location: data.location,
      isActive: data.isActive,
      isHidden: data.isHidden,
      lastUpdated: new Date().toISOString(),
    };

    setCategories((prev) => [...prev, newCategory]);
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (!editingCategory) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              ...data,
              lastUpdated: new Date().toISOString(),
            }
          : category
      )
    );

    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!editingCategory) return;

    setCategories((prev) =>
      prev.filter((category) => category.id !== editingCategory.id)
    );

    setIsDeleteDialogOpen(false);
    setEditingCategory(null);
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
    categories,
    paginatedCategories,
    filteredCategories,
    editingCategory,

    // State setters
    setCategories,
    setEditingCategory,

    // UI state
    filterValue,
    setFilterValue,
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
    handleSort,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handlePageChange,
    handlePageSizeChange,
  };
}
