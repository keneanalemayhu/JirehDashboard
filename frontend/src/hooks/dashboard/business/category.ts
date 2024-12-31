/* eslint-disable prefer-const */
"use client";

import { useState, useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  Category,
  CategoryFormData,
  CategoryFilters,
  ColumnVisibility,
  DEFAULT_COLUMN_VISIBILITY,
  SortDirection,
} from "@/types/dashboard/business/category";
import { useLocations } from "@/hooks/dashboard/business/location";

// Sample initial data matching new interface
const initialCategories: Category[] = [
  {
    id: 1,
    businessId: 1,
    locationId: 1,
    name: "Electronics",
    description: "Electronic devices and accessories",
    isActive: true,
    isHidden: false,
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    businessId: 1,
    locationId: 1,
    name: "Clothing",
    description: "Fashion and apparel items",
    isActive: true,
    isHidden: false,
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    businessId: 1,
    locationId: 2,
    name: "Food & Beverages",
    description: "Food items and drinks",
    isActive: true,
    isHidden: false,
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    businessId: 1,
    locationId: 3,
    name: "Home & Living",
    description: "Household items and furniture",
    isActive: true,
    isHidden: false,
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];


export function useCategories(
  defaultCategories: Category[] = initialCategories
) {
  const { locations, getLocationName } = useLocations();

  // States
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: "",
    locationId: null,
    isActive: null,
    isHidden: null,
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
  });

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>(
    DEFAULT_COLUMN_VISIBILITY
  );
  const [sortColumn, setSortColumn] = useState<keyof Category | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Enhanced filtering with memo
  const filteredCategories = useMemo(() => {
    let result = [...categories];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm) ||
          category.description.toLowerCase().includes(searchTerm) ||
          getLocationName(category.locationId)
            .toLowerCase()
            .includes(searchTerm)
      );
    }

    // Apply other filters
    if (filters.locationId !== null) {
      result = result.filter(
        (category) => category.locationId === filters.locationId
      );
    }

    if (filters.isActive !== null) {
      result = result.filter(
        (category) => category.isActive === filters.isActive
      );
    }

    if (filters.isHidden !== null) {
      result = result.filter(
        (category) => category.isHidden === filters.isHidden
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter((category) => {
        const categoryDate = new Date(category.createdAt);
        return (
          categoryDate >= filters.dateRange.start! &&
          categoryDate <= filters.dateRange.end!
        );
      });
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else if (sortDirection === "desc") {
          return String(bValue).localeCompare(String(aValue));
        }
        return 0;
      });
    }

    return result;
  }, [categories, filters, sortColumn, sortDirection, getLocationName]);

  // Pagination with memo
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<CategoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

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
      id: Math.max(...categories.map((c) => c.id), 0) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
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
              updatedAt: new Date(),
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

  return {
    // Data
    categories,
    filteredCategories,
    paginatedCategories,
    editingCategory,
    locations,
    getLocationName,

    // State
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
    filters,

    // Handlers
    handleFilterChange,
    handleSort,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handlePageChange: (page: number) => setCurrentPage(page),
    handlePageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    setEditingCategory,
  };
}
