"use client";

import { useState, useMemo } from "react";
import {
  Order,
  OrderFormData,
  PaymentStatus,
  SortDirection,
} from "@/types/dashboard/business/retail/owner/order";

const initialOrders: Order[] = [
  {
    id: "ORD-001",
    itemName: "Product A",
    quantity: 2,
    unitPrice: 100.0,
    employee: "John Doe",
    userName: "Jane Smith",
    paymentStatus: PaymentStatus.PENDING,
  },
];

export function useOrders(defaultOrders: Order[] = initialOrders) {
  // States
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [filterValue, setFilterValue] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    orderId: true,
    itemName: true,
    quantity: true,
    unitPrice: true,
    subtotal: true,
    employee: true,
    userName: true,
    totalAmount: true,
    paymentStatus: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Order | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredOrders = useMemo(() => {
    const ordersToFilter = orders || [];
    const searchTerm = filterValue.toLowerCase();

    const result = ordersToFilter.filter((order) => {
      const searchableFields = [
        order.itemName || "",
        order.employee || "",
        order.userName || "",
        order.paymentStatus || "",
        order.quantity?.toString() || "",
        order.unitPrice?.toString() || "",
        order.totalAmount?.toString() || "",
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm)
      );
    });

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle number type specifically for quantity, unit price, and total amount
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

        // Convert to strings for other comparisons
        const aString = String(aValue || "");
        const bString = String(bValue || "");

        if (sortDirection === "asc") {
          return aString.localeCompare(bString);
        } else if (sortDirection === "desc") {
          return bString.localeCompare(aString);
        }
        return 0;
      });
    }

    return result;
  }, [orders, filterValue, sortColumn, sortDirection]);

  // Pagination
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Handlers
  const handleSort = (column: keyof Order) => {
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

  const handleAddOrder = (data: OrderFormData) => {
    const newId = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    const newOrder: Order = {
      id: newId,
      ...data,
      subtotal: data.quantity * data.unitPrice,
      totalAmount: data.quantity * data.unitPrice,
    };
    setOrders((prev) => [...prev, newOrder]);
    setIsAddDialogOpen(false);
  };

  const handleEditOrder = (data: OrderFormData) => {
    if (!editingOrder) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === editingOrder.id
          ? {
              ...order,
              itemName: data.itemName,
              quantity: data.quantity,
              unitPrice: data.unitPrice,
              employee: data.employee,
              userName: data.userName,
              paymentStatus: data.paymentStatus,
              subtotal: data.quantity * data.unitPrice,
              totalAmount: data.quantity * data.unitPrice,
            }
          : order
      )
    );
    setIsEditDialogOpen(false);
    setEditingOrder(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    // Data
    orders,
    paginatedOrders,
    filteredOrders,
    editingOrder,

    // State setters
    setOrders,
    setEditingOrder,

    // UI state
    filterValue,
    setFilterValue,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,

    // Table state
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,

    // Handlers
    handleSort,
    handleAddOrder,
    handleEditOrder,
    handlePageChange,
    handlePageSizeChange,
  };
}
