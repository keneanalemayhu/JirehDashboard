"use client";

import { useState, useMemo } from "react";
import {
  Item,
  ItemFormData,
  SortDirection,
} from "@/types/dashboard/admin/item";

const initialItems: Item[] = [
  {
    id: "ITM-001",
    name: "Item 1",
    price: "9.99",
    category: "Category 1",
    isHidden: false,
  },
];

export function useItems(defaultItems: Item[] = initialItems) {
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [filterValue, setFilterValue] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    price: true,
    category: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Item | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    const itemsToFilter = items || [];

    const result = itemsToFilter.filter((item) =>
      [item.name, item.price, item.category]
        .join(" ")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortColumn === "price") {
          return sortDirection === "asc"
            ? parseFloat(aValue as string) - parseFloat(bValue as string)
            : parseFloat(bValue as string) - parseFloat(aValue as string);
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
  }, [items, filterValue, sortColumn, sortDirection]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

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
      isHidden: data.isHidden,
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

  return {
    items,
    filterValue,
    setFilterValue,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingItem,
    setEditingItem,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredItems,
    paginatedItems,
    pageSize,
    currentPage,
    handlePageChange,
    handlePageSizeChange,
  };
}
