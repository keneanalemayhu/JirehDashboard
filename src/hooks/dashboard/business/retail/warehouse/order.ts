"use client";

import { useState, useMemo } from "react";

interface Order {
  order_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  employee_name: string;
  user_name: string;
  total_amount: number;
  payment_status: "PENDING" | "PAID" | "CANCELLED";
}

type SortDirection = "asc" | "desc" | null;

const initialOrders: Order[] = [
  {
    order_id: "ORD-001",
    item_name: "Sample Item",
    quantity: 2,
    unit_price: 1000,
    subtotal: 2000,
    employee_name: "John Doe",
    user_name: "Jane Smith",
    total_amount: 2000,
    payment_status: "PENDING",
  },
];

export function useOrders(defaultOrders: Order[] = initialOrders) {
  // States
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [filterValue, setFilterValue] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof Order | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // Filtering and sorting
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    const searchTerm = filterValue.toLowerCase();

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((order) =>
        statusFilter.includes(order.payment_status)
      );
    }

    // Apply search filter
    result = result.filter((order) => {
      const searchableFields = [
        order.order_id,
        order.item_name,
        order.employee_name,
        order.user_name,
        order.payment_status,
        order.total_amount.toString(),
      ];

      return searchableFields.some((field) =>
        field.toLowerCase().includes(searchTerm)
      );
    });

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // Handle number type for numeric fields
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
  }, [orders, filterValue, sortColumn, sortDirection, statusFilter]);

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

  const handleUpdatePaymentStatus = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === updatedOrder.order_id
          ? { ...order, payment_status: updatedOrder.payment_status }
          : order
      )
    );
    setIsDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      }
      return [...prev, status];
    });
  };

  return {
    // Data
    orders,
    paginatedOrders,
    filteredOrders,
    selectedOrder,

    // State setters
    setOrders,
    setSelectedOrder,

    // UI state
    filterValue,
    setFilterValue,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    statusFilter,

    // Table state
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,

    // Handlers
    handleSort,
    handleUpdatePaymentStatus,
    handlePageChange,
    handlePageSizeChange,
    handleStatusFilterChange,
  };
}
