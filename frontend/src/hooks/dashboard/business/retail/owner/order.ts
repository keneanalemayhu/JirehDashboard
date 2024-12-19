"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Order,
  OrderFilters,
  PaymentStatus,
  OrderStatus,
  PaymentMethod,
  CategoryAnalytics,
  ItemSalesAnalytics,
  CustomerAnalytics,
  UseOrdersReturn,
} from "@/types/dashboard/business/retail/owner/order";

export const initialOrders: Order[] = [
  {
    order_id: "ORD-001",
    store_id: 1,
    location_id: 1,
    user_id: 1,
    employee_id: 1,
    order_number: "ORD/2024/001",
    status: OrderStatus.PENDING,
    payment_status: PaymentStatus.PENDING,
    payment_method: PaymentMethod.CASH,
    customer: {
      name: "John Doe",
      phone: "+251911234567",
      email: "john.doe@example.com",
    },
    items: [
      {
        item_id: 1,
        category_id: 1,
        item_name: "Item 1",
        category_name: "Category 1",
        quantity: 2,
        unit_price: 1000,
        subtotal: 2000,
      },
    ],
    total_amount: 2000,
    employee_name: "Abebe Kebede",
    user_name: "abebe.kebede",
    order_date: "2024-07-26T10:00:00.000Z",
    created_at: "2024-07-26T10:00:00.000Z",
    updated_at: "2024-07-26T10:00:00.000Z",
  },
  {
    order_id: "ORD-002",
    store_id: 2,
    location_id: 2,
    user_id: 2,
    employee_id: 2,
    order_number: "ORD/2024/002",
    status: OrderStatus.COMPLETED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.BANK_TRANSFER,
    customer: {
      name: "Jane Smith",
      phone: "+251922345678",
      email: "jane.smith@example.com",
    },
    items: [
      {
        item_id: 2,
        category_id: 2,
        item_name: "Item 2",
        category_name: "Category 2",
        quantity: 1,
        unit_price: 1500,
        subtotal: 1500,
      },
    ],
    total_amount: 1500,
    employee_name: "Kebede Abebe",
    user_name: "kebede.abebe",
    order_date: "2024-07-27T11:00:00.000Z",
    created_at: "2024-07-27T11:00:00.000Z",
    updated_at: "2024-07-27T11:00:00.000Z",
  },
  {
    order_id: "ORD-003",
    store_id: 3,
    location_id: 3,
    user_id: 3,
    employee_id: 3,
    order_number: "ORD/2024/003",
    status: OrderStatus.CANCELLED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.TELEBIRR,
    customer: {
      name: "Musa Ali",
      phone: "+251933456789",
      email: "musa.ali@example.com",
    },
    items: [
      {
        item_id: 3,
        category_id: 3,
        item_name: "Item 3",
        category_name: "Category 3",
        quantity: 5,
        unit_price: 500,
        subtotal: 2500,
      },
    ],
    total_amount: 2500,
    employee_name: "Tesfaye Alemu",
    user_name: "tesfaye.alemu",
    order_date: "2024-07-28T09:30:00.000Z",
    created_at: "2024-07-28T09:30:00.000Z",
    updated_at: "2024-07-28T09:30:00.000Z",
  },
  {
    order_id: "ORD-004",
    store_id: 4,
    location_id: 4,
    user_id: 4,
    employee_id: 4,
    order_number: "ORD/2024/004",
    status: OrderStatus.CANCELLED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.CASH,
    customer: {
      name: "Selamawit Bekele",
      phone: "+251944567890",
      email: "selamawit.bekele@example.com",
    },
    items: [
      {
        item_id: 4,
        category_id: 4,
        item_name: "Item 4",
        category_name: "Category 4",
        quantity: 3,
        unit_price: 750,
        subtotal: 2250,
      },
    ],
    total_amount: 2250,
    employee_name: "Mulugeta Demeke",
    user_name: "mulugeta.demeke",
    order_date: "2024-07-29T12:00:00.000Z",
    created_at: "2024-07-29T12:00:00.000Z",
    updated_at: "2024-07-29T12:00:00.000Z",
  },
  {
    order_id: "ORD-005",
    store_id: 5,
    location_id: 5,
    user_id: 5,
    employee_id: 5,
    order_number: "ORD/2024/005",
    status: OrderStatus.PENDING,
    payment_status: PaymentStatus.PENDING,
    payment_method: PaymentMethod.TELEBIRR,
    customer: {
      name: "Biniam Solomon",
      phone: "+251955678901",
      email: "biniam.solomon@example.com",
    },
    items: [
      {
        item_id: 5,
        category_id: 5,
        item_name: "Item 5",
        category_name: "Category 5",
        quantity: 2,
        unit_price: 1200,
        subtotal: 2400,
      },
    ],
    total_amount: 2400,
    employee_name: "Fitsum Tadesse",
    user_name: "fitsum.tadesse",
    order_date: "2024-07-30T13:45:00.000Z",
    created_at: "2024-07-30T13:45:00.000Z",
    updated_at: "2024-07-30T13:45:00.000Z",
  },
  {
    order_id: "ORD-006",
    store_id: 6,
    location_id: 6,
    user_id: 6,
    employee_id: 6,
    order_number: "ORD/2024/006",
    status: OrderStatus.COMPLETED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.BANK_TRANSFER,
    customer: {
      name: "Liya Amanuel",
      phone: "+251966789012",
      email: "liya.amanuel@example.com",
    },
    items: [
      {
        item_id: 6,
        category_id: 6,
        item_name: "Item 6",
        category_name: "Category 6",
        quantity: 1,
        unit_price: 3500,
        subtotal: 3500,
      },
    ],
    total_amount: 3500,
    employee_name: "Hana Getachew",
    user_name: "hana.getachew",
    order_date: "2024-07-31T10:30:00.000Z",
    created_at: "2024-07-31T10:30:00.000Z",
    updated_at: "2024-07-31T10:30:00.000Z",
  },
  {
    order_id: "ORD-007",
    store_id: 7,
    location_id: 7,
    user_id: 7,
    employee_id: 7,
    order_number: "ORD/2024/007",
    status: OrderStatus.PENDING,
    payment_status: PaymentStatus.PENDING,
    payment_method: PaymentMethod.BANK_TRANSFER,
    customer: {
      name: "Mikias Yohannes",
      phone: "+251977890123",
      email: "mikias.yohannes@example.com",
    },
    items: [
      {
        item_id: 7,
        category_id: 7,
        item_name: "Item 7",
        category_name: "Category 7",
        quantity: 4,
        unit_price: 1800,
        subtotal: 7200,
      },
    ],
    total_amount: 7200,
    employee_name: "Samuel Worku",
    user_name: "samuel.worku",
    order_date: "2024-08-01T09:00:00.000Z",
    created_at: "2024-08-01T09:00:00.000Z",
    updated_at: "2024-08-01T09:00:00.000Z",
  },
  {
    order_id: "ORD-008",
    store_id: 8,
    location_id: 8,
    user_id: 8,
    employee_id: 8,
    order_number: "ORD/2024/008",
    status: OrderStatus.COMPLETED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.CASH,
    customer: {
      name: "Hana Desta",
      phone: "+251988901234",
      email: "hana.desta@example.com",
    },
    items: [
      {
        item_id: 8,
        category_id: 8,
        item_name: "Item 8",
        category_name: "Category 8",
        quantity: 2,
        unit_price: 2500,
        subtotal: 5000,
      },
    ],
    total_amount: 5000,
    employee_name: "Woineshet Tadesse",
    user_name: "woineshet.tadesse",
    order_date: "2024-08-02T14:15:00.000Z",
    created_at: "2024-08-02T14:15:00.000Z",
    updated_at: "2024-08-02T14:15:00.000Z",
  },
  {
    order_id: "ORD-009",
    store_id: 9,
    location_id: 9,
    user_id: 9,
    employee_id: 9,
    order_number: "ORD/2024/009",
    status: OrderStatus.PENDING,
    payment_status: PaymentStatus.PENDING,
    payment_method: PaymentMethod.CREDIT,
    customer: {
      name: "Berhanu Zewdu",
      phone: "+251999012345",
      email: "berhanu.zewdu@example.com",
    },
    items: [
      {
        item_id: 9,
        category_id: 9,
        item_name: "Item 9",
        category_name: "Category 9",
        quantity: 3,
        unit_price: 1500,
        subtotal: 4500,
      },
    ],
    total_amount: 4500,
    employee_name: "Eyerus Gizaw",
    user_name: "eyerus.gizaw",
    order_date: "2024-08-03T16:30:00.000Z",
    created_at: "2024-08-03T16:30:00.000Z",
    updated_at: "2024-08-03T16:30:00.000Z",
  },
  {
    order_id: "ORD-010",
    store_id: 10,
    location_id: 10,
    user_id: 10,
    employee_id: 10,
    order_number: "ORD/2024/010",
    status: OrderStatus.CANCELLED,
    payment_status: PaymentStatus.PAID,
    payment_method: PaymentMethod.CREDIT,
    customer: {
      name: "Kidist Aklilu",
      phone: "+251910123456",
      email: "kidist.aklilu@example.com",
    },
    items: [
      {
        item_id: 10,
        category_id: 10,
        item_name: "Item 10",
        category_name: "Category 10",
        quantity: 6,
        unit_price: 900,
        subtotal: 5400,
      },
    ],
    total_amount: 5400,
    employee_name: "Dereje Fikadu",
    user_name: "dereje.fikadu",
    order_date: "2024-08-04T18:45:00.000Z",
    created_at: "2024-08-04T18:45:00.000Z",
    updated_at: "2024-08-04T18:45:00.000Z",
  },
];

const DEFAULT_PAGE_SIZE = 10;

export function useOrders(defaultOrders: Order[] = []): UseOrdersReturn {
  // Core state
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Filters and pagination state
  const [filters, setFilters] = useState<OrderFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortColumn, setSortColumn] = useState<keyof Order | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  // Filtered orders computation
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      result = result.filter((order) => {
        const searchableFields = [
          order.order_id,
          order.order_number,
          order.customer.name,
          order.customer.phone,
          order.customer.email,
          order.employee_name,
          order.user_name,
          ...order.items.map((item) => item.item_name),
          ...order.items.map((item) => item.category_name),
        ];
        return searchableFields.some((field) =>
          field?.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply status filters
    if (filters.status?.length) {
      result = result.filter((order) => filters.status?.includes(order.status));
    }

    // Apply payment status filters
    if (filters.paymentStatus?.length) {
      result = result.filter((order) =>
        filters.paymentStatus?.includes(order.payment_status)
      );
    }

    // Apply payment method filters
    if (filters.paymentMethod?.length) {
      result = result.filter((order) =>
        filters.paymentMethod?.includes(order.payment_method)
      );
    }

    // Apply category filters
    if (filters.categoryIds?.length) {
      result = result.filter((order) =>
        order.items.some((item) =>
          filters.categoryIds?.includes(item.category_id)
        )
      );
    }

    // Apply date range filters
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      result = result.filter((order) => {
        const orderDate = new Date(order.order_date);
        return orderDate >= start && orderDate <= end;
      });
    }

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

        return sortDirection === "asc"
          ? aString.localeCompare(bString)
          : bString.localeCompare(aString);
      });
    }

    return result;
  }, [orders, filters, sortColumn, sortDirection]);

  // Paginated orders computation
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOrders.slice(startIndex, startIndex + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Analytics functions
  const getAnalyticsByCategory = useCallback((): CategoryAnalytics[] => {
    const analytics = new Map<number, CategoryAnalytics>();

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = analytics.get(item.category_id) || {
          category_id: item.category_id,
          category_name: item.category_name,
          total_sales: 0,
          total_items: 0,
          total_revenue: 0,
          average_order_value: 0,
        };

        existing.total_sales += 1;
        existing.total_items += item.quantity;
        existing.total_revenue += item.subtotal;
        existing.average_order_value =
          existing.total_revenue / existing.total_sales;

        analytics.set(item.category_id, existing);
      });
    });

    return Array.from(analytics.values());
  }, [filteredOrders]);

  const getTopSellingItems = useCallback(
    (limit: number = 10): ItemSalesAnalytics[] => {
      const itemAnalytics = new Map<number, ItemSalesAnalytics>();

      filteredOrders.forEach((order) => {
        order.items.forEach((item) => {
          const existing = itemAnalytics.get(item.item_id) || {
            item_id: item.item_id,
            item_name: item.item_name,
            category_name: item.category_name,
            total_quantity: 0,
            total_revenue: 0,
            average_price: 0,
            stock_level: 0, // Would need to be updated from inventory system
          };

          existing.total_quantity += item.quantity;
          existing.total_revenue += item.subtotal;
          existing.average_price =
            existing.total_revenue / existing.total_quantity;

          itemAnalytics.set(item.item_id, existing);
        });
      });

      return Array.from(itemAnalytics.values())
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, limit);
    },
    [filteredOrders]
  );

  const getCustomerAnalytics = useCallback((): CustomerAnalytics[] => {
    const analytics = new Map<string, CustomerAnalytics>();

    filteredOrders.forEach((order) => {
      const customerKey =
        order.customer.phone || order.customer.email || "unknown";
      const existing = analytics.get(customerKey) || {
        customer_phone: order.customer.phone || "",
        customer_name: order.customer.name || "Unknown",
        total_orders: 0,
        total_amount: 0,
        average_order_value: 0,
        last_order_date: order.order_date,
      };

      existing.total_orders += 1;
      existing.total_amount += order.total_amount;
      existing.average_order_value =
        existing.total_amount / existing.total_orders;

      if (new Date(order.order_date) > new Date(existing.last_order_date)) {
        existing.last_order_date = order.order_date;
      }

      analytics.set(customerKey, existing);
    });

    return Array.from(analytics.values());
  }, [filteredOrders]);

  // Order operations
  const createOrder = useCallback(async (order: Omit<Order, "order_id">) => {
    try {
      setIsLoading(true);
      // API call would go here
      setOrders((prev) => [
        ...prev,
        { ...order, order_id: `ORD-${Date.now()}` },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to create order")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrder = useCallback(
    async (orderId: string, updates: Partial<Order>) => {
      try {
        setIsLoading(true);
        // API call would go here
        setOrders((prev) =>
          prev.map((order) =>
            order.order_id === orderId ? { ...order, ...updates } : order
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to update order")
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteOrder = useCallback(async (orderId: string) => {
    try {
      setIsLoading(true);
      // API call would go here
      setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete order")
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // Data state
    orders,
    selectedOrder,
    isLoading,
    error,

    // Filters and pagination
    filters,
    currentPage,
    pageSize,
    paginatedOrders,
    totalPages: Math.ceil(filteredOrders.length / pageSize),

    // Actions
    setFilters: (newFilters: Partial<OrderFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1); // Reset to first page on filter change
    },
    setPage: setCurrentPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1); // Reset to first page on size change
    },
    selectOrder: setSelectedOrder,

    // Order operations
    createOrder,
    updateOrder,
    deleteOrder,

    // Analytics
    getAnalyticsByCategory,
    getTopSellingItems,
    getCustomerAnalytics,

    // Sorting
    sortColumn,
    sortDirection,
    handleSort: (column: keyof Order) => {
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
    },
  };
}
