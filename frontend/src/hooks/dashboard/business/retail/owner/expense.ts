"use client";

import { useState, useMemo } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  Expense,
  ExpenseFormData,
  ExpenseFilters,
  ColumnVisibility,
  DEFAULT_COLUMN_VISIBILITY,
  SortDirection,
} from "@/types/dashboard/business/retail/owner/expense";
import { useLocations } from "@/hooks/dashboard/business/retail/owner/location";

// Enhanced initial expenses with sample data matching new interface
const initialExpenses: Expense[] = [
  {
    id: 1,
    businessId: 1,
    locationId: 1,
    name: "Office Supplies",
    amount: 150.75,
    description: "Office Supplies - Q1",
    expenseDate: new Date("2024-03-15"),
    paymentMethod: "Credit Card",
    receiptNumber: "REC-001",
    receiptImageUrl: null,
    isRecurring: false,
    recurringFrequency: "monthly",
    recurringEndDate: new Date("2024-12-31"),
    createdBy: 1,
    approvedBy: 2,
    approvalStatus: "approved",
    approvalDate: new Date("2024-03-16"),
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-16"),
  },
  {
    id: 2,
    businessId: 1,
    locationId: 2,
    name: "Monthly Rent",
    amount: 2500.0,
    description: "Office space rental payment - April",
    expenseDate: new Date("2024-04-01"),
    paymentMethod: "Bank Transfer",
    receiptNumber: "REC-002",
    receiptImageUrl: null,
    isRecurring: true,
    recurringFrequency: "monthly",
    recurringEndDate: new Date("2025-03-31"),
    createdBy: 1,
    approvedBy: 2,
    approvalStatus: "approved",
    approvalDate: new Date("2024-03-30"),
    createdAt: new Date("2024-03-30"),
    updatedAt: new Date("2024-03-30"),
  },
  {
    id: 3,
    businessId: 1,
    locationId: 1,
    name: "Internet Service",
    amount: 89.99,
    description: "Monthly internet subscription",
    expenseDate: new Date("2024-04-05"),
    paymentMethod: "Credit Card",
    receiptNumber: "REC-003",
    receiptImageUrl: null,
    isRecurring: true,
    recurringFrequency: "monthly",
    recurringEndDate: null,
    createdBy: 1,
    approvedBy: null,
    approvalStatus: "pending",
    approvalDate: null,
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05"),
  },
  {
    id: 4,
    businessId: 1,
    locationId: 2,
    name: "Equipment Repair",
    amount: 450.0,
    description: "Printer maintenance and repair",
    expenseDate: new Date("2024-04-10"),
    paymentMethod: "Cash",
    receiptNumber: "REC-004",
    receiptImageUrl: null,
    isRecurring: false,
    recurringFrequency: null,
    recurringEndDate: null,
    createdBy: 2,
    approvedBy: 1,
    approvalStatus: "approved",
    approvalDate: new Date("2024-04-10"),
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: 5,
    businessId: 1,
    locationId: 1,
    name: "Software License",
    amount: 299.99,
    description: "Annual accounting software subscription",
    expenseDate: new Date("2024-04-15"),
    paymentMethod: "Credit Card",
    receiptNumber: "REC-005",
    receiptImageUrl: null,
    isRecurring: true,
    recurringFrequency: "yearly",
    recurringEndDate: new Date("2027-04-15"),
    createdBy: 1,
    approvedBy: 2,
    approvalStatus: "approved",
    approvalDate: new Date("2024-04-15"),
    createdAt: new Date("2024-04-15"),
    updatedAt: new Date("2024-04-15"),
  },
  {
    id: 6,
    businessId: 1,
    locationId: 2,
    name: "Office Furniture",
    amount: 1299.99,
    description: "New ergonomic chairs for meeting room",
    expenseDate: new Date("2024-04-18"),
    paymentMethod: "Debit Card",
    receiptNumber: "REC-006",
    receiptImageUrl: null,
    isRecurring: false,
    recurringFrequency: null,
    recurringEndDate: null,
    createdBy: 2,
    approvedBy: null,
    approvalStatus: "rejected",
    approvalDate: new Date("2024-04-19"),
    createdAt: new Date("2024-04-18"),
    updatedAt: new Date("2024-04-19"),
  },
];

export function useExpenses(defaultExpenses: Expense[] = initialExpenses) {
  const { locations, getLocationName } = useLocations();

  const [filters, setFilters] = useState<ExpenseFilters>({
    search: "",
    locationId: null,
    isRecurring: null,
    approvalStatus: "",
    dateRange: {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    },
    paymentMethod: "",
    minAmount: null,
    maxAmount: null,
  });

  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>(
    DEFAULT_COLUMN_VISIBILITY
  );
  const [sortColumn, setSortColumn] = useState<keyof Expense | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Enhanced filtering
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (expense) =>
          expense.name.toLowerCase().includes(searchTerm) ||
          expense.description?.toLowerCase().includes(searchTerm) ||
          expense.receiptNumber?.toLowerCase().includes(searchTerm) ||
          expense.amount.toString().includes(searchTerm) ||
          getLocationName(expense.locationId).toLowerCase().includes(searchTerm)
      );
    }

    // Apply other filters...
    if (filters.locationId !== null) {
      result = result.filter(
        (expense) => expense.locationId === filters.locationId
      );
    }

    if (filters.isRecurring !== null) {
      result = result.filter(
        (expense) => expense.isRecurring === filters.isRecurring
      );
    }

    if (filters.approvalStatus) {
      result = result.filter(
        (expense) => expense.approvalStatus === filters.approvalStatus
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      result = result.filter((expense) => {
        const expenseDate = new Date(expense.expenseDate);
        return (
          expenseDate >= filters.dateRange.start! &&
          expenseDate <= filters.dateRange.end!
        );
      });
    }

    // Apply sorting
    if (sortColumn) {
      result.sort((a, b) => {
        let aValue = a[sortColumn];
        let bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else if (sortDirection === "desc") {
          return String(bValue).localeCompare(String(aValue));
        }
        return 0;
      });
    }

    return result;
  }, [expenses, filters, sortColumn, sortDirection, getLocationName]);

  // Calculate paginated expenses
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<ExpenseFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSort = (column: keyof Expense) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense: Expense = {
      id: Math.max(...expenses.map((e) => e.id), 0) + 1,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setExpenses((prev) => [...prev, newExpense]);
    setIsAddDialogOpen(false);
  };

  const handleEditExpense = (data: ExpenseFormData) => {
    if (!editingExpense) return;

    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === editingExpense.id
          ? { ...expense, ...data, updatedAt: new Date() }
          : expense
      )
    );

    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  const handleDeleteExpense = () => {
    if (!editingExpense) return;

    setExpenses((prev) =>
      prev.filter((expense) => expense.id !== editingExpense.id)
    );

    setIsDeleteDialogOpen(false);
    setEditingExpense(null);
  };

  return {
    // Data
    expenses,
    filteredExpenses,
    paginatedExpenses,
    editingExpense,
    locations,
    getLocationName,

    // State
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

    // Handlers
    handleFilterChange,
    handleSort,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    handlePageChange: (page: number) => setCurrentPage(page),
    handlePageSizeChange: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    setEditingExpense,
  };
}
