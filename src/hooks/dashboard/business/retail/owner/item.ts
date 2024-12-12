// src/hooks/dashboard/business/retail/admin/item.ts

import { useState, useMemo } from "react";
import {
  Item,
  ItemFormData,
  SortDirection,
} from "@/types/dashboard/business/retail/admin/item";

const initialItems: Item[] = [
  {
    id: "ITM-001",
    name: "Samsung Galaxy S21",
    barcode: "890123456789",
    price: "999.99",
    quantity: 50,
    category: "Electronics",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-01"),
  },
  {
    id: "ITM-002",
    name: "iPhone 13 Pro",
    barcode: "123456789012",
    price: "1099.99",
    quantity: 30,
    category: "Electronics",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-02"),
  },
  {
    id: "ITM-003",
    name: "Dell XPS 15",
    barcode: "345678901234",
    price: "1499.99",
    quantity: 20,
    category: "Computers",
    isActive: true,
    isHidden: true,
    lastInventoryUpdate: new Date("2024-03-03"),
  },
  {
    id: "ITM-004",
    name: "Sony Headphones",
    barcode: "567890123456",
    price: "299.99",
    quantity: 100,
    category: "Audio",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-04"),
  },
  {
    id: "ITM-005",
    name: "iPad Air",
    barcode: "789012345678",
    price: "599.99",
    quantity: 45,
    category: "Tablets",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-05"),
  },
  {
    id: "ITM-006",
    name: "LG 4K TV",
    barcode: "901234567890",
    price: "799.99",
    quantity: 15,
    category: "Electronics",
    isActive: false,
    isHidden: true,
    lastInventoryUpdate: new Date("2024-03-06"),
  },
  {
    id: "ITM-007",
    name: "Canon EOS R5",
    barcode: "234567890123",
    price: "3899.99",
    quantity: 10,
    category: "Cameras",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-07"),
  },
  {
    id: "ITM-008",
    name: "MacBook Pro",
    barcode: "456789012345",
    price: "1999.99",
    quantity: 25,
    category: "Computers",
    isActive: true,
    isHidden: true,
    lastInventoryUpdate: new Date("2024-03-08"),
  },
  {
    id: "ITM-009",
    name: "AirPods Pro",
    barcode: "678901234567",
    price: "249.99",
    quantity: 75,
    category: "Audio",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-09"),
  },
  {
    id: "ITM-010",
    name: "Surface Laptop",
    barcode: "012345678901",
    price: "1299.99",
    quantity: 35,
    category: "Computers",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-10"),
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
    barcode: true,
    price: true,
    quantity: true,
    category: true,
    lastInventoryUpdate: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Item | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredItems = useMemo(() => {
    const itemsToFilter = items || [];

    const result = itemsToFilter.filter(
      (item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.barcode.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.category.toLowerCase().includes(filterValue.toLowerCase()) ||
        item.price.toLowerCase().includes(filterValue.toLowerCase())
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

        if (sortColumn === "quantity" || sortColumn === "lastInventoryUpdate") {
          const aVal = aValue as number | Date;
          const bVal = bValue as number | Date;
          return sortDirection === "asc"
            ? Number(aVal) - Number(bVal)
            : Number(bVal) - Number(aVal);
        }

        if (typeof aValue === "boolean") {
          return sortDirection === "asc" ? (aValue ? 1 : -1) : aValue ? -1 : 1;
        }

        if (sortDirection === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else {
          return String(bValue).localeCompare(String(aValue));
        }
      });
    }

    return result;
  }, [items, filterValue, sortColumn, sortDirection]);

  // Pagination
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
      ...data,
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

  return {
    items,
    paginatedItems,
    filteredItems,
    editingItem,
    setItems,
    setEditingItem,
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
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handlePageChange,
    handlePageSizeChange,
  };
}
