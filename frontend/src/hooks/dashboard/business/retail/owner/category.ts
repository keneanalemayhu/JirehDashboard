"use client";

import { useState, useMemo } from "react";
import {
  Category,
  CategoryFormData,
  SortDirection,
} from "@/types/dashboard/business/retail/admin/category";

const initialCategories = [
  {
    id: "1",
    name: "Category 1",
    description: "Gadgets, software, and digital trends",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "2",
    name: "Category 2",
    description: "Exploring the world, one destination at a time",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "3",
    name: "Category 3",
    description: "Delicious recipes and culinary adventures",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "4",
    name: "Category 4",
    description: "The latest trends in style and beauty",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "5",
    name: "Category 5",
    description: "Healthy living and workout tips",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "6",
    name: "Category 6",
    description: "Money management and investment advice",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "7",
    name: "Category 7",
    description: "The world of video games and esports",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "8",
    name: "Category 8",
    description: "Literary reviews and book recommendations",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "9",
    name: "Category 9",
    description: "Exploring the world of music, from classical to pop",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "10",
    name: "Category 10",
    description: "Appreciating the beauty of visual arts",
    location: "Location 1",
    isHidden: false,
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
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortDirection === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
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

  // Fixed handlers
  const handleSort = (column: keyof Category) => {
    if (sortColumn === column) {
      // Cycle through: asc -> desc -> null
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
    // Generate new ID as a string
    const newId = `CAT-${String(categories.length + 1).padStart(3, "0")}`;

    const newCategory: Category = {
      id: newId, // Now newId is a string
      name: data.name,
      description: data.description,
      location: data.location,
      isHidden: data.isHidden,
    };

    setCategories((prev) => [...prev, newCategory]);
    setIsAddDialogOpen(false);
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (!editingCategory) return;

    // Update categories with edited data
    setCategories((prev) =>
      prev.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              ...data,
            }
          : category
      )
    );

    // Reset states
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!editingCategory) return;

    // Remove the category
    setCategories((prev) =>
      prev.filter((category) => category.id !== editingCategory.id)
    );

    // Reset states
    setIsDeleteDialogOpen(false);
    setEditingCategory(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
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
