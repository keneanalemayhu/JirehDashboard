"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { ExpenseTable } from "@/components/dashboard/business/owner/expenses/ExpenseTable";
import { ExpenseTableSettings } from "@/components/dashboard/business/owner/expenses/ExpenseTableSettings";
import { ExpenseTablePagination } from "@/components/dashboard/business/owner/expenses/ExpenseTablePagination";
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
import { useLocations } from "@/hooks/dashboard/business/location";
import { ExpenseForm } from "@/components/dashboard/business/owner/expenses/ExpenseForm";

export default function ExpensesPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState<"regular" | "recurring">(
    "regular"
  );

  const { locations, getLocationName } = useLocations();

  const {
    expenses,
    filteredExpenses,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingExpense,
    setEditingExpense,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  } = useExpenses();

  // Calculate pagination
  const totalExpenses = filteredExpenses?.length || 0;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedExpenses = filteredExpenses?.slice(startIndex, endIndex) || [];

  // Calculate regular and recurring expense totals
  const regularExpenses = filteredExpenses.filter(
    (expense) => !expense.isRecurring
  );
  const recurringExpenses = filteredExpenses.filter(
    (expense) => expense.isRecurring
  );
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
    const headers = [
      "ID",
      "Name",
      "Amount",
      "Location",
      "Date",
      "Payment Method",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredExpenses.map((expense) =>
        [
          expense.id,
          `"${expense.name}"`,
          expense.amount,
          `"${getLocationName(expense.locationId)}"`,
          new Date(expense.expenseDate).toISOString().split("T")[0],
          `"${expense.paymentMethod}"`,
          `"${expense.approvalStatus}"`,
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
                    locations={locations} // Now locations is defined
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
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
              <ExpenseTableSettings
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
                showRecurringColumns={activeTab === "recurring"}
              />
            </div>
          </div>

          {/* Table */}
          <ExpenseTable
            expenses={expenses}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(expense: Expense) => {
              setEditingExpense(expense);
              setIsEditDialogOpen(true);
            }}
            onDelete={(expense: Expense) => {
              setEditingExpense(expense);
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingExpense={editingExpense}
            onEditSubmit={handleEditExpense}
            onDeleteConfirm={handleDeleteExpense}
            getLocationName={getLocationName}
            locations={locations}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Pagination */}
          <ExpenseTablePagination
            totalExpenses={filteredExpenses.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            expenseType={activeTab}
            totalRegularExpenses={regularExpenses.length}
            totalRecurringExpenses={recurringExpenses.length}
            totalRegularAmount={totalRegularAmount}
            totalRecurringAmount={totalRecurringAmount}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
