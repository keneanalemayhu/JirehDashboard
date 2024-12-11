// src/hooks/dashboard/business/retail/owner/item.ts

import { useState, useMemo } from "react";
import {
  Item,
  ItemFormData,
  SortDirection,
  DEFAULT_COLUMN_VISIBILITY,
  initialItems,
} from "@/types/dashboard/business/retail/warehouse/item";

export const initialItems: Item[] = [
  {
    id: "ITM-001",
    name: "Nike Air Max 270",
    barcode: "978020137962",
    price: 149,
    quantity: 50,
    category: "Footwear",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-15T10:30:00"),
  },
  {
    id: "ITM-002",
    name: "Adidas Ultraboost",
    barcode: "978020137963",
    price: 179.99,
    quantity: 35,
    category: "Footwear",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-15T11:45:00"),
  },
  {
    id: "ITM-003",
    name: "Under Armour T-Shirt",
    barcode: "978020137964",
    price: 29.99,
    quantity: 100,
    category: "Apparel",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-14T09:15:00"),
  },
  {
    id: "ITM-004",
    name: "Nike Dri-FIT Shorts",
    barcode: "978020137965",
    price: 34.99,
    quantity: 75,
    category: "Apparel",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-14T14:20:00"),
  },
  {
    id: "ITM-005",
    name: "Puma Running Shoes",
    barcode: "978020137966",
    price: 89.99,
    quantity: 25,
    category: "Footwear",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-13T16:30:00"),
  },
  {
    id: "ITM-006",
    name: "New Balance 990",
    barcode: "978020137967",
    price: 174.99,
    quantity: 15,
    category: "Footwear",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-13T13:45:00"),
  },
  {
    id: "ITM-007",
    name: "Nike Pro Leggings",
    barcode: "978020137968",
    price: 49.99,
    quantity: 60,
    category: "Apparel",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-12T11:20:00"),
  },
  {
    id: "ITM-008",
    name: "Adidas Soccer Ball",
    barcode: "978020137969",
    price: 24.99,
    quantity: 40,
    category: "Equipment",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-12T10:15:00"),
  },
  {
    id: "ITM-009",
    name: "Under Armour Backpack",
    barcode: "978020137970",
    price: 54.99,
    quantity: 30,
    category: "Accessories",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-11T15:30:00"),
  },
  {
    id: "ITM-010",
    name: "Nike Training Gloves",
    barcode: "978020137971",
    price: 19.99,
    quantity: 45,
    category: "Accessories",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-11T14:45:00"),
  },
  {
    id: "ITM-011",
    name: "Adidas Water Bottle",
    barcode: "978020137972",
    price: 14.99,
    quantity: 85,
    category: "Accessories",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-10T09:30:00"),
  },
  {
    id: "ITM-012",
    name: "Puma Sports Socks",
    barcode: "978020137973",
    price: 12.99,
    quantity: 120,
    category: "Accessories",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-10T08:15:00"),
  },
  {
    id: "ITM-013",
    name: "Nike Basketball",
    barcode: "978020137974",
    price: 29.99,
    quantity: 25,
    category: "Equipment",
    isActive: false,
    isHidden: true,
    lastInventoryUpdate: new Date("2024-03-09T16:45:00"),
  },
  {
    id: "ITM-014",
    name: "Under Armour Hat",
    barcode: "978020137975",
    price: 24.99,
    quantity: 55,
    category: "Accessories",
    isActive: true,
    isHidden: false,
    lastInventoryUpdate: new Date("2024-03-09T14:30:00"),
  },
  {
    id: "ITM-015",
    name: "Adidas Wind Breaker",
    barcode: "978020137976",
    price: 79.99,
    quantity: 0,
    category: "Apparel",
    isActive: false,
    isHidden: true,
    lastInventoryUpdate: new Date("2024-03-08T11:20:00"),
  },
];

export function useItems(defaultItems: Item[] = initialItems) {
  const [items, setItems] = useState<Item[]>(defaultItems || []); // Ensure items is initialized as an empty array if defaultItems is undefined
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

  const filteredItems = useMemo(() => {
    const itemsToFilter = items; // No need to check for undefined since items is guaranteed to be an array

    const result = itemsToFilter.filter((item) =>
      [
        item.name,
        item.barcode,
        item.price,
        item.category,
        item.quantity.toString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );

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

  const generateNewId = () => {
    const maxId = items.reduce((max, item) => {
      const idNumber = parseInt(item.id.replace("ITM-", ""), 10);
      return idNumber > max ? idNumber : max;
    }, 0);
    return `ITM-${String(maxId + 1).padStart(3, "0")}`;
  };

  const handleAddItem = (data: ItemFormData) => {
    const newId = generateNewId();

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
            ? new Date(item.lastInventoryUpdate).toLocaleString()
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
    handleExport,
  };
}
