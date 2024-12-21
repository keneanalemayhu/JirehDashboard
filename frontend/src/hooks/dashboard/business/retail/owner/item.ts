// src/hooks/dashboard/business/retail/admin/item.ts

import { useState, useMemo } from "react";
import {
  Item,
  ItemFormData,
  SortDirection,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/item";

const initialItems: Item[] = [
  {
    id: "ITM-001",
    name: "Regular Item 1",
    barcode: "890123456789",
    price: "999.99",
    quantity: 1,
    categoryId: 1,
    isActive: true,
    isHidden: false,
    isTemporary: false,
    expiryHours: null,
    autoResetQuantity: false,
    lastQuantityReset: null,
    lastInventoryUpdate: new Date("2024-03-01"),
  },
  {
    id: "ITM-002",
    name: "Temporary Item 1",
    barcode: "123456789012",
    price: "1099.99",
    quantity: 30,
    categoryId: 1,
    isActive: true,
    isHidden: false,
    isTemporary: true,
    expiryHours: 24,
    autoResetQuantity: true,
    lastQuantityReset: new Date("2024-03-02"),
    lastInventoryUpdate: new Date("2024-03-02"),
  },
  // Add more sample items as needed
];

export function useItems(defaultItems: Item[] = initialItems) {
  // Basic state
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [filterValue, setFilterValue] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<"regular" | "temporary">(
    "regular"
  );

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Table state
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>({
    id: true,
    name: true,
    barcode: true,
    price: true,
    quantity: true,
    categoryId: true,
    lastInventoryUpdate: true,
    isActive: true,
    isHidden: true,
    isTemporary: true,
    expiryHours: true,
    autoResetQuantity: true,
    temporaryStatus: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Item | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredItems = useMemo(() => {
    let itemsToFilter = items || [];

    // First filter by type (regular/temporary)
    itemsToFilter = itemsToFilter.filter((item) =>
      activeTab === "regular" ? !item.isTemporary : item.isTemporary
    );

    // Then filter by search value
    const filtered = itemsToFilter.filter(
      (item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.barcode.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.categoryId
          .toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase()) ||
        item.price.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle different types of values
        if (sortColumn === "price") {
          return sortDirection === "asc"
            ? parseFloat(aValue as string) - parseFloat(bValue as string)
            : parseFloat(bValue as string) - parseFloat(aValue as string);
        }

        if (
          sortColumn === "quantity" ||
          sortColumn === "lastInventoryUpdate" ||
          sortColumn === "expiryHours" ||
          sortColumn === "lastQuantityReset"
        ) {
          const aVal = aValue as number | Date;
          const bVal = bValue as number | Date;
          return sortDirection === "asc"
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }

        if (typeof aValue === "boolean") {
          return sortDirection === "asc" ? (aValue ? 1 : -1) : aValue ? -1 : 1;
        }

        return sortDirection === "asc"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return filtered;
  }, [items, filterValue, sortColumn, sortDirection, activeTab]);

  // Pagination
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
      ...data,
      lastInventoryUpdate: new Date(),
      lastQuantityReset: data.isTemporary ? new Date() : null,
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
              lastQuantityReset: data.isTemporary
                ? data.autoResetQuantity !== item.autoResetQuantity
                  ? new Date()
                  : item.lastQuantityReset
                : null,
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

  const handleTabChange = (tab: "regular" | "temporary") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return {
    // Data
    items,
    paginatedItems,
    filteredItems,
    editingItem,

    // State setters
    setItems,
    setEditingItem,

    // UI state
    filterValue,
    setFilterValue,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,

    // Table state
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,

    // Handlers
    handleSort,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handlePageChange,
    handlePageSizeChange,
    handleTabChange,
  };
}
