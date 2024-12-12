"use client";

import { useState, useMemo } from "react";
import {
  Order,
  PaymentStatus,
} from "@/types/dashboard/business/retail/admin/order";

type SortDirection = "asc" | "desc" | null;

// Helper function to generate dates
const generateRandomDate = (startDate: Date, endDate: Date) => {
  return new Date(
    startDate.getTime() +
      Math.random() * (endDate.getTime() - startDate.getTime())
  ).toISOString();
};

// Get date ranges for sample data
const getCurrentDateRanges = () => {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  return { now, thirtyDaysAgo };
};

const { now, thirtyDaysAgo } = getCurrentDateRanges();

const initialOrders: Order[] = [
  {
    order_id: "ORD-001",
    item_name: "Sample Item 1",
    quantity: 2,
    unit_price: 1000,
    subtotal: 2000,
    employee_name: "Abebe Kebede",
    user_name: "abebe.kebede",
    total_amount: 2000,
    payment_status: PaymentStatus.PENDING,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-002",
    item_name: "Sample Item 2",
    quantity: 3,
    unit_price: 500,
    subtotal: 1500,
    employee_name: "Alice Johnson",
    user_name: "alice.johnson",
    total_amount: 1500,
    payment_status: PaymentStatus.PAID,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-011",
    item_name: "Item 11",
    quantity: 2,
    unit_price: 100,
    subtotal: 200,
    employee_name: "Employee 11",
    user_name: "user11",
    total_amount: 200,
    payment_status: PaymentStatus.PENDING,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-012",
    item_name: "Item 12",
    quantity: 3,
    unit_price: 50,
    subtotal: 150,
    employee_name: "Employee 12",
    user_name: "user12",
    total_amount: 150,
    payment_status: PaymentStatus.PAID,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-013",
    item_name: "Item 13",
    quantity: 4,
    unit_price: 25,
    subtotal: 100,
    employee_name: "Employee 13",
    user_name: "user13",
    total_amount: 100,
    payment_status: PaymentStatus.PENDING,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-014",
    item_name: "Item 14",
    quantity: 5,
    unit_price: 20,
    subtotal: 100,
    employee_name: "Employee 14",
    user_name: "user14",
    total_amount: 100,
    payment_status: PaymentStatus.PAID,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-015",
    item_name: "Item 15",
    quantity: 6,
    unit_price: 15,
    subtotal: 90,
    employee_name: "Employee 15",
    user_name: "user15",
    total_amount: 90,
    payment_status: PaymentStatus.PENDING,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-016",
    item_name: "Item 16",
    quantity: 7,
    unit_price: 12,
    subtotal: 84,
    employee_name: "Employee 16",
    user_name: "user16",
    total_amount: 84,
    payment_status: PaymentStatus.PAID,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-017",
    item_name: "Item 17",
    quantity: 8,
    unit_price: 10,
    subtotal: 80,
    employee_name: "Employee 17",
    user_name: "user17",
    total_amount: 80,
    payment_status: PaymentStatus.PENDING,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-018",
    item_name: "Item 18",
    quantity: 9,
    unit_price: 9,
    subtotal: 81,
    employee_name: "Employee 18",
    user_name: "user18",
    total_amount: 81,
    payment_status: PaymentStatus.PAID,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-019",
    item_name: "Item 19",
    quantity: 10,
    unit_price: 8,
    subtotal: 80,
    employee_name: "Employee 19",
    user_name: "user19",
    total_amount: 80,
    payment_status: PaymentStatus.CANCELLED,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
  {
    order_id: "ORD-020",
    item_name: "Item 20",
    quantity: 11,
    unit_price: 7,
    subtotal: 77,
    employee_name: "Employee 20",
    user_name: "user20",
    total_amount: 77,
    payment_status: PaymentStatus.CANCELLED,
    created_at: generateRandomDate(thirtyDaysAgo, now),
    updated_at: generateRandomDate(thirtyDaysAgo, now),
  },
];

export function useOrders(defaultOrders: Order[] = initialOrders) {
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

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }

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

  // Get orders filtered by timeframe
  const getFilteredOrdersByTimeframe = (timeframe: string) => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return filteredOrders.filter((order) => {
      const orderDate = new Date(order.created_at);

      switch (timeframe) {
        case "today":
          return orderDate >= startOfDay;
        case "week":
          return orderDate >= startOfWeek;
        case "month":
          return orderDate >= startOfMonth;
        case "year":
          return orderDate >= startOfYear;
        default:
          return true;
      }
    });
  };

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
        order.order_id === updatedOrder.order_id ? updatedOrder : order
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
    orders,
    paginatedOrders,
    filteredOrders,
    selectedOrder,
    setOrders,
    setSelectedOrder,
    filterValue,
    setFilterValue,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    statusFilter,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,
    handleSort,
    handleUpdatePaymentStatus,
    handlePageChange,
    handlePageSizeChange,
    handleStatusFilterChange,
    getFilteredOrdersByTimeframe,
  };
}
