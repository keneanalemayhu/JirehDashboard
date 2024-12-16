"use client";

import { useState, useMemo } from "react";

interface Expense {
  id: number;
  name: string;
  amount: number;
  location: string;
  expenseDate: string;
  frequency:
    | "One-time"
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "Yearly";
}

type ExpenseFormData = Omit<Expense, "id">;
type SortDirection = "asc" | "desc" | null;

// Sample initial data
const initialExpenses: Expense[] = [
  {
    id: 1,
    name: "Office Supplies",
    amount: 150.75,
    location: "Location 1",
    expenseDate: "2024-03-15",
    frequency: "Monthly",
  },
  {
    id: 2,
    name: "Equipment Maintenance",
    amount: 450.0,
    location: "Location 2",
    expenseDate: "2024-03-14",
    frequency: "Quarterly",
  },
  {
    id: 3,
    name: "Software Licenses",
    amount: 299.99,
    location: "Remote",
    expenseDate: "2024-04-01",
    frequency: "Yearly",
  },
  {
    id: 4,
    name: "Marketing Campaign",
    amount: 1500.0,
    location: "Location 1",
    expenseDate: "2024-05-10",
    frequency: "One-time",
  },
  {
    id: 5,
    name: "Travel Expenses",
    amount: 350.25,
    location: "Various",
    expenseDate: "2024-06-12",
    frequency: "Monthly",
  },
  {
    id: 6,
    name: "Utilities",
    amount: 120.5,
    location: "Location 1",
    expenseDate: "2024-07-15",
    frequency: "Monthly",
  },
  {
    id: 7,
    name: "Insurance Premiums",
    amount: 500.0,
    location: "Remote",
    expenseDate: "2024-08-01",
    frequency: "Yearly",
  },
  {
    id: 8,
    name: "Office Rent",
    amount: 2500.0,
    location: "Location 1",
    expenseDate: "2024-09-01",
    frequency: "Monthly",
  },
  {
    id: 9,
    name: "IT Support Contract",
    amount: 1000.0,
    location: "Remote",
    expenseDate: "2024-10-15",
    frequency: "Quarterly",
  },
  {
    id: 10,
    name: "Training and Development",
    amount: 800.0,
    location: "Various",
    expenseDate: "2024-11-20",
    frequency: "Yearly",
  },
];

export function useExpenses(defaultExpenses: Expense[] = initialExpenses) {
  // States
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [filterValue, setFilterValue] = useState("");
  const [filterFrequency, setFilterFrequency] = useState<
    Expense["frequency"] | ""
  >("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    amount: true,
    location: true,
    expenseDate: true,
    frequency: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Expense | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredExpenses = useMemo(() => {
    const expensesToFilter = expenses || [];

    const result = expensesToFilter.filter((expense) => {
      const matchesSearch =
        expense.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        expense.location.toLowerCase().includes(filterValue.toLowerCase()) ||
        expense.amount.toString().includes(filterValue) ||
        expense.frequency.toLowerCase().includes(filterValue.toLowerCase()) ||
        expense.expenseDate.includes(filterValue);

      const matchesFrequency =
        !filterFrequency || expense.frequency === filterFrequency;

      return matchesSearch && matchesFrequency;
    });

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortDirection === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return 0;
      });
    }

    return result;
  }, [expenses, filterValue, filterFrequency, sortColumn, sortDirection]);

  // Pagination
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredExpenses.slice(startIndex, startIndex + pageSize);
  }, [filteredExpenses, currentPage, pageSize]);

  // Get expense total by frequency
  const expenseTotalsByFrequency = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
      const frequency = expense.frequency;
      acc[frequency] = (acc[frequency] || 0) + expense.amount;
      return acc;
    }, {} as Record<Expense["frequency"], number>);
  }, [filteredExpenses]);

  // Handlers
  const handleSort = (column: keyof Expense) => {
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

  const handleAddExpense = (data: ExpenseFormData) => {
    const newId = Math.max(...expenses.map((e) => e.id), 0) + 1;

    const newExpense: Expense = {
      id: newId,
      ...data,
    };

    setExpenses((prev) => [...prev, newExpense]);
    setIsAddDialogOpen(false);
  };

  const handleEditExpense = (data: Expense) => {
    setExpenses((prev) =>
      prev.map((expense) => (expense.id === data.id ? data : expense))
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    // Data
    expenses,
    paginatedExpenses,
    filteredExpenses,
    editingExpense,
    expenseTotalsByFrequency,

    // State setters
    setExpenses,
    setEditingExpense,

    // UI state
    filterValue,
    setFilterValue,
    filterFrequency,
    setFilterFrequency,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Table state
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,

    // Handlers
    handleSort,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    handlePageChange,
    handlePageSizeChange,
  };
}
