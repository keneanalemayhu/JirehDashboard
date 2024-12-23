"use client";

import { useState, useMemo } from "react";
import {
  Category,
  CategoryFormData,
  SortDirection,
} from "@/types/dashboard/business/retail/admin/category";

const initialCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Technology",
    description: "Gadgets, software, and digital trends",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-002",
    name: "Travel",
    description: "Exploring the world, one destination at a time",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "CAT-003",
    name: "Food",
    description: "Delicious recipes and culinary adventures",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "CAT-004",
    name: "Fashion",
    description: "The latest trends in style and beauty",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-005",
    name: "Fitness",
    description: "Healthy living and workout tips",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "CAT-006",
    name: "Finance",
    description: "Money management and investment advice",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "CAT-007",
    name: "Gaming",
    description: "The world of video games and esports",
    location: "Location 1",
    isHidden: false,
  },
  {
    id: "CAT-008",
    name: "Books",
    description: "Literary reviews and book recommendations",
    location: "Location 2",
    isHidden: false,
  },
  {
    id: "CAT-009",
    name: "Music",
    description: "Exploring the world of music, from classical to pop",
    location: "Location 3",
    isHidden: false,
  },
  {
    id: "CAT-010",
    name: "Art",
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
    // Generate new ID
    const newId = `CAT-${String(categories.length + 1).padStart(3, "0")}`;

    // Create new category with all fields
    const newCategory: Category = {
      id: newId,
      name: data.name,
      description: data.description,
      location: data.location,
      isHidden: data.isHidden,
    };

    // Update categories
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
