//

"use client";

import { useState, useMemo } from "react";
import {
  Item,
  ItemFormData,
  SortDirection,
  ColumnVisibility,
} from "@/types/dashboard/business/item";

const initialItems: Item[] = [
  {
    id: "1",
    name: "Samsung Galaxy S24",
    barcode: "890123456789",
    price: "999.99",
    quantity: 10,
    categoryId: 1, // Electronics
    isActive: true,
    isHidden: false,
    isTemporary: false,
    expiryHours: null,
    autoResetQuantity: false,
    lastQuantityReset: null,
    lastInventoryUpdate: new Date("2024-03-01"),
  },
  {
    id: "2",
    name: "Flash Sale - Nike Air Max",
    barcode: "123456789012",
    price: "199.99",
    quantity: 30,
    categoryId: 2, // Clothing
    isActive: true,
    isHidden: false,
    isTemporary: true,
    expiryHours: 24,
    autoResetQuantity: true,
    lastQuantityReset: new Date("2024-03-02"),
    lastInventoryUpdate: new Date("2024-03-02"),
  },
  {
    id: "3",
    name: "Coffee Maker Deluxe",
    barcode: "345678901234",
    price: "299.99",
    quantity: 15,
    categoryId: 3, // Home & Kitchen
    isActive: true,
    isHidden: false,
    isTemporary: false,
    expiryHours: null,
    autoResetQuantity: false,
    lastQuantityReset: null,
    lastInventoryUpdate: new Date("2024-03-01"),
  },
  {
    id: "4",
    name: "Limited Edition Book Set",
    barcode: "456789012345",
    price: "149.99",
    quantity: 5,
    categoryId: 4, // Books
    isActive: true,
    isHidden: false,
    isTemporary: true,
    expiryHours: 48,
    autoResetQuantity: false,
    lastQuantityReset: new Date("2024-03-02"),
    lastInventoryUpdate: new Date("2024-03-02"),
  },
  {
    id: "5",
    name: "Fresh Organic Juice",
    barcode: "567890123456",
    price: "5.99",
    quantity: 50,
    categoryId: 6, // Food & Beverages
    isActive: true,
    isHidden: false,
    isTemporary: true,
    expiryHours: 12,
    autoResetQuantity: true,
    lastQuantityReset: new Date("2024-03-03"),
    lastInventoryUpdate: new Date("2024-03-03"),
  },
];

export function useItems(defaultItems: Item[] = initialItems) {
  // Basic state
  const [items, setItems] = useState<Item[]>(defaultItems);
  const [filterValue, setFilterValue] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<"regular" | "temporary">(
    "regular"
  );
  const [error] = useState<string | null>(null);

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
    lastQuantityReset: true,
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
    let itemsToFilter = [...items];

    // First filter by type (regular/temporary)
    itemsToFilter = itemsToFilter.filter((item) =>
      activeTab === "regular" ? !item.isTemporary : item.isTemporary
    );

    // Then apply search filter if there's a value
    if (filterValue.trim()) {
      const searchTerm = filterValue.toLowerCase();
      itemsToFilter = itemsToFilter.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          (item.barcode && item.barcode.toLowerCase().includes(searchTerm)) ||
          item.categoryId.toString().includes(searchTerm) ||
          (item.price && item.price.toString().includes(searchTerm))
      );
    }

    // Apply sorting if there's a sort column
    if (sortColumn) {
      itemsToFilter.sort((a, b) => {
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

    return itemsToFilter;
  }, [items, filterValue, sortColumn, sortDirection, activeTab]);

  // Get expired and active temporary items
  const getTemporaryItemStatus = (item: Item): string => {
    if (!item.isTemporary || !item.lastQuantityReset) return "New";

    const expiryTime = new Date(item.lastQuantityReset);
    expiryTime.setHours(expiryTime.getHours() + (item.expiryHours || 0));
    const now = new Date();

    if (now > expiryTime) return "Expired";

    const hoursRemaining = Math.ceil(
      (expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    );
    return `${hoursRemaining}h remaining`;
  };

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
    error,

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
    getTemporaryItemStatus,
  };
}
