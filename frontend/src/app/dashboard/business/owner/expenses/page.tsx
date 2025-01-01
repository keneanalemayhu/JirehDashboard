"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { ExpenseTable } from "@/components/dashboard/business/owner/expenses/ExpenseTable";
import { ExpenseTableSettings } from "@/components/dashboard/business/owner/expenses/ExpenseTableSettings";
import { useExpenses } from "@/hooks/dashboard/business/expense";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/dashboard/business/owner/expenses/ExpenseForm";
import { ExpenseFormData } from "@/types/dashboard/business/expense";
import { toast } from "sonner"

export default function ExpensesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<null | { id: number }>(null);

  // TODO: Get businessId from auth context
  const businessId = 1;

  const {
    expenses,
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
    refresh,
  } = useExpenses(businessId);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  // Calculate totals
  const regularExpenses = expenses ? expenses.filter((expense) => !expense.is_recurring) : [];
  const recurringExpenses = expenses ? expenses.filter((expense) => expense.is_recurring) : [];
  const totalRegularAmount = regularExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const totalRecurringAmount = recurringExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Export expenses
  const handleExport = () => {
    if (!expenses || expenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }

    const headers = [
      "ID",
      "Category",
      "Amount",
      "Description",
      "Date",
      "Payment Method",
      "Receipt Number",
    ];
    const csvContent = [
      headers.join(","),
      ...expenses.map((expense) =>
        [
          expense.id,
          `"${expense.category_name}"`,
          expense.amount,
          `"${expense.description || ''}"`,
          expense.expense_date,
          `"${expense.payment_method}"`,
          `"${expense.receipt_number || ''}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      await createExpense(data);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to create expense:", error);
    }
  };

  const handleEditExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    try {
      await updateExpense(editingExpense.id, data);
      setIsEditDialogOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  const handleDeleteExpense = async () => {
    if (!editingExpense) return;
    try {
      await deleteExpense(editingExpense.id);
      setIsDeleteDialogOpen(false);
      setEditingExpense(null);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  if (error) {
    return (
      <SidebarLayout>
        <Header />
        <div className="flex-1 p-8 pt-6">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Expenses Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your business expenses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Expenses"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new expense.
                    </DialogDescription>
                  </DialogHeader>
                  <ExpenseForm
                    onSubmit={handleAddExpense}
                    businessId={businessId}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Filter expenses..."
                className="max-w-sm"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <ExpenseTableSettings
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
          </div>

          {/* Table */}
          <ExpenseTable
            expenses={expenses}
            columnsVisible={columnsVisible}
            onEdit={(expense) => {
              setEditingExpense(expense);
              setIsEditDialogOpen(true);
            }}
            onDelete={(expense) => {
              setEditingExpense(expense);
              setIsDeleteDialogOpen(true);
            }}
            getCategoryName={(id) => categories.find(c => c.id === id)?.name || ''}
          />

          {/* Summary */}
          <div className="flex justify-between items-center p-4 bg-background border rounded-lg">
            <div>
              <h3 className="font-semibold">Regular Expenses</h3>
              <p className="text-2xl font-bold">${totalRegularAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{regularExpenses.length} expenses</p>
            </div>
            <div>
              <h3 className="font-semibold">Recurring Expenses</h3>
              <p className="text-2xl font-bold">${totalRecurringAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{recurringExpenses.length} expenses</p>
            </div>
            <div>
              <h3 className="font-semibold">Total Expenses</h3>
              <p className="text-2xl font-bold">${(totalRegularAmount + totalRecurringAmount).toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{expenses.length} expenses</p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
