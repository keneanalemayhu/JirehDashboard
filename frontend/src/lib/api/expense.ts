import { api } from "./api";
import { Expense, ExpenseFormData, ExpenseCategory } from "@/types/dashboard/business/expense";

export const expenseApi = {
  // Expense Categories
  getExpenseCategories: async (businessId: number): Promise<ExpenseCategory[]> => {
    const response = await api.get(`/api/inventory/business/${businessId}/expense-categories/`);
    return response.data.data;
  },

  createExpenseCategory: async (businessId: number, data: Omit<ExpenseCategory, 'id' | 'business' | 'created_at' | 'updated_at'>): Promise<ExpenseCategory> => {
    const response = await api.post(`/api/inventory/business/${businessId}/expense-categories/`, data);
    return response.data.data;
  },

  updateExpenseCategory: async (businessId: number, categoryId: number, data: Partial<ExpenseCategory>): Promise<ExpenseCategory> => {
    const response = await api.patch(`/api/inventory/business/${businessId}/expense-categories/${categoryId}/`, data);
    return response.data.data;
  },

  deleteExpenseCategory: async (businessId: number, categoryId: number): Promise<void> => {
    await api.delete(`/api/inventory/business/${businessId}/expense-categories/${categoryId}/`);
  },

  // Expenses
  getExpenses: async (businessId: number): Promise<Expense[]> => {
    const response = await api.get(`/api/inventory/business/${businessId}/expenses/`);
    return response.data.data;
  },

  createExpense: async (businessId: number, data: ExpenseFormData): Promise<Expense> => {
    const response = await api.post(`/api/inventory/business/${businessId}/expenses/`, data);
    return response.data.data;
  },

  updateExpense: async (businessId: number, expenseId: number, data: Partial<ExpenseFormData>): Promise<Expense> => {
    const response = await api.patch(`/api/inventory/business/${businessId}/expenses/${expenseId}/`, data);
    return response.data.data;
  },

  deleteExpense: async (businessId: number, expenseId: number): Promise<void> => {
    await api.delete(`/api/inventory/business/${businessId}/expenses/${expenseId}/`);
  },
};
