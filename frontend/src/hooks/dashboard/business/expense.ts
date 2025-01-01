"use client";

import { useState, useMemo, useCallback } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import {
  Expense,
  ExpenseFormData,
  ExpenseFilters,
  ColumnVisibility,
  DEFAULT_COLUMN_VISIBILITY,
  SortDirection,
  ExpenseCategory,
} from "@/types/dashboard/business/expense";
import { expenseApi } from "@/lib/api/expense";
import { toast } from "sonner";

const initialFilters: ExpenseFilters = {
  search: "",
  categoryId: null,
  isRecurring: null,
  dateRange: {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  },
  paymentMethod: "",
  minAmount: null,
  maxAmount: null,
};

export function useExpenses(businessId: number) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>(initialFilters);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>(DEFAULT_COLUMN_VISIBILITY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch expenses and categories
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [expensesData, categoriesData] = await Promise.all([
        expenseApi.getExpenses(businessId),
        expenseApi.getExpenseCategories(businessId),
      ]);
      setExpenses(expensesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch expenses data");
      toast.error("Failed to fetch expenses data");
    } finally {
      setIsLoading(false);
    }
  }, [businessId]);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    // If expenses is undefined or null, return an empty array
    if (!expenses) return [];

    return expenses.filter((expense) => {
      const matchesSearch =
        !filters.search ||
        expense.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.receipt_number?.toLowerCase().includes(filters.search.toLowerCase()) ||
        expense.category_name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        !filters.categoryId || expense.category === filters.categoryId;

      const matchesRecurring =
        filters.isRecurring === null || expense.is_recurring === filters.isRecurring;

      const matchesPaymentMethod =
        !filters.paymentMethod || expense.payment_method === filters.paymentMethod;

      const matchesAmount =
        (!filters.minAmount || expense.amount >= filters.minAmount) &&
        (!filters.maxAmount || expense.amount <= filters.maxAmount);

      const expenseDate = new Date(expense.expense_date);
      const matchesDateRange =
        (!filters.dateRange.start || expenseDate >= filters.dateRange.start) &&
        (!filters.dateRange.end || expenseDate <= filters.dateRange.end);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesRecurring &&
        matchesPaymentMethod &&
        matchesAmount &&
        matchesDateRange
      );
    });
  }, [expenses, filters]);

  // CRUD operations
  const createExpense = async (data: ExpenseFormData) => {
    try {
      const newExpense = await expenseApi.createExpense(businessId, data);
      setExpenses((prev) => [...prev, newExpense]);
      toast.success("Expense created successfully");
    } catch (err) {
      toast.error("Failed to create expense");
      throw err;
    }
  };

  const updateExpense = async (expenseId: number, data: Partial<ExpenseFormData>) => {
    try {
      const updatedExpense = await expenseApi.updateExpense(businessId, expenseId, data);
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === expenseId ? updatedExpense : expense))
      );
      toast.success("Expense updated successfully");
    } catch (err) {
      toast.error("Failed to update expense");
      throw err;
    }
  };

  const deleteExpense = async (expenseId: number) => {
    try {
      await expenseApi.deleteExpense(businessId, expenseId);
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseId));
      toast.success("Expense deleted successfully");
    } catch (err) {
      toast.error("Failed to delete expense");
      throw err;
    }
  };

  // Category operations
  const createCategory = async (data: Omit<ExpenseCategory, 'id' | 'business' | 'created_at' | 'updated_at'>) => {
    try {
      const newCategory = await expenseApi.createExpenseCategory(businessId, data);
      setCategories((prev) => [...prev, newCategory]);
      toast.success("Category created successfully");
    } catch (err) {
      toast.error("Failed to create category");
      throw err;
    }
  };

  const updateCategory = async (categoryId: number, data: Partial<ExpenseCategory>) => {
    try {
      const updatedCategory = await expenseApi.updateExpenseCategory(businessId, categoryId, data);
      setCategories((prev) =>
        prev.map((category) => (category.id === categoryId ? updatedCategory : category))
      );
      toast.success("Category updated successfully");
    } catch (err) {
      toast.error("Failed to update category");
      throw err;
    }
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      await expenseApi.deleteExpenseCategory(businessId, categoryId);
      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error("Failed to delete category");
      throw err;
    }
  };

  return {
    expenses: filteredExpenses,
    categories,
    filters,
    setFilters,
    columnsVisible,
    setColumnsVisible,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    createCategory,
    updateCategory,
    deleteCategory,
    refresh: fetchData,
  };
}
