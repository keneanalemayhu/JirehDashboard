// src/hooks/dashboard/admin/category.ts

import { useState, useMemo } from "react";
import {
  Category,
  CategoryFormData,
  SortDirection,
  initialCategories,
} from "@/types/dashboard/admin/category";

export function useCategories() {
  // Data state
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filterValue, setFilterValue] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // UI state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Table state
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    description: true,
    location: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Category | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredCategories = useMemo(() => {
    let result = categories.filter((category) =>
      Object.values(category)
        .filter((value): value is string => typeof value === "string")
        .some((value) =>
          value.toLowerCase().includes(filterValue.toLowerCase())
        )
    );

    if (sortColumn) {
      result.sort((a, b) => {
        if (a[sortColumn] < b[sortColumn])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn])
          return sortDirection === "asc" ? 1 : -1;
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
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddCategory = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: `CAT-${String(categories.length + 1).padStart(3, "0")}`,
      ...data,
    };
    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...editingCategory, ...data } : cat
        )
      );
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = () => {
    if (editingCategory) {
      setCategories(categories.filter((cat) => cat.id !== editingCategory.id));
      setIsDeleteDialogOpen(false);
      setEditingCategory(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
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

    // Handlers
    handleSort,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handlePageChange,
    handlePageSizeChange,
  };
}
