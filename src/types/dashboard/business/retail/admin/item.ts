"use client";

import { useState, useMemo } from "react";
import {
  Item,
  ItemFormData,
  SortDirection,
  DEFAULT_COLUMN_VISIBILITY,
  initialItems,
  FilterConfig,
  PaginationConfig,
  SortConfig,
} from "@/types/dashboard/business/retail/admin/item";

export function useItems(defaultItems: Item[] = initialItems) {
  // State management
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [filterValue, setFilterValue] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState(
    DEFAULT_COLUMN_VISIBILITY
  );
  const [sortColumn, setSortColumn] = useState<keyof Item | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterConfig>({
    search: "",
    isActive: undefined,
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minQuantity: undefined,
    maxQuantity: undefined,
  });

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    const itemsToFilter = items || [];

    const result = itemsToFilter.filter((item) => {
      // Basic search filter
      const searchMatch = [
        item.name,
        item.barcode,
        item.price,
        item.category,
        item.quantity.toString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(filterValue.toLowerCase());

      // Advanced filters
      const categoryMatch =
        !filter.category || item.category === filter.category;
      const activeMatch =
        filter.isActive === undefined || item.isActive === filter.isActive;
      const priceMatch =
        (!filter.minPrice || parseFloat(item.price) >= filter.minPrice) &&
        (!filter.maxPrice || parseFloat(item.price) <= filter.maxPrice);
      const quantityMatch =
        (!filter.minQuantity || item.quantity >= filter.minQuantity) &&
        (!filter.maxQuantity || item.quantity <= filter.maxQuantity);

      return (
        searchMatch &&
        categoryMatch &&
        activeMatch &&
        priceMatch &&
        quantityMatch
      );
    });

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle different types of sorting
        if (sortColumn === "price") {
          return sortDirection === "asc"
            ? parseFloat(aValue as string) - parseFloat(bValue as string)
            : parseFloat(bValue as string) - parseFloat(aValue as string);
        }

        if (sortColumn === "quantity") {
          return sortDirection === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }

        if (sortColumn === "lastInventoryUpdate") {
          const aDate = aValue as Date;
          const bDate = bValue as Date;
          return sortDirection === "asc"
            ? aDate.getTime() - bDate.getTime()
            : bDate.getTime() - aDate.getTime();
        }

        if (typeof aValue === "boolean") {
          return sortDirection === "asc" ? (aValue ? 1 : -1) : aValue ? -1 : 1;
        }

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortDirection === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return 0;
      });
    }

    return result;
  }, [items, filterValue, sortColumn, sortDirection, filter]);

  // Memoized paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handlers
  const handleSort = (column: keyof Item) => {
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

  const handleAddItem = (data: ItemFormData) => {
    const newId = `ITM-${String(items.length + 1).padStart(3, "0")}`;

    const newItem: Item = {
      id: newId,
      name: data.name,
      price: data.price,
      category: data.category,
      barcode: data.barcode,
      quantity: data.quantity,
      isActive: data.isActive,
      isHidden: data.isHidden,
      lastInventoryUpdate: new Date(),
    };

    setItems((prev) => [...prev, newItem]);
    setIsAddDialogOpen(false);
  };

  const handleEditItem = (data: ItemFormData) => {
    if (!editingItem) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              ...data,
              lastInventoryUpdate: new Date(),
            }
          : item
      )
    );

    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = () => {
    if (!editingItem) return;

    setItems((prev) => prev.filter((item) => item.id !== editingItem.id));
    setIsDeleteDialogOpen(false);
    setEditingItem(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter: Partial<FilterConfig>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Barcode",
      "Price",
      "Quantity",
      "Category",
      "Status",
      "Visibility",
      "Last Updated",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredItems.map((item) =>
        [
          item.id,
          `"${item.name}"`,
          `"${item.barcode || ""}"`,
          item.price,
          item.quantity,
          `"${item.category}"`,
          item.isActive ? "Active" : "Inactive",
          item.isHidden ? "Hidden" : "Visible",
          item.lastInventoryUpdate
            ? item.lastInventoryUpdate.toISOString()
            : "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `items-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    // State
    items,
    filterValue,
    setFilterValue,
    filter,
    handleFilterChange,
    editingItem,
    setEditingItem,
    columnsVisible,
    setColumnsVisible,

    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Handlers
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleSort,
    handleExport,

    // Pagination
    filteredItems,
    paginatedItems,
    pageSize,
    currentPage,
    handlePageChange,
    handlePageSizeChange,

    // Sorting
    sortColumn,
    sortDirection,
  };
}
