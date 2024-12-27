"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  Expense,
  ColumnVisibility,
  ExpenseFormData,
} from "@/types/dashboard/business/expense";
import { ExpenseTableHeader } from "./ExpenseTableHeader";
import { ExpenseTableRow } from "./ExpenseTableRow";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpenseForm } from "./ExpenseForm";
import { useLocations } from "@/hooks/dashboard/business/location";

interface ExpenseTableProps {
  expenses: Expense[]; // Changed from {displayedExpenses}
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingExpense: Expense | null;
  onEditSubmit: (data: ExpenseFormData) => void;
  onDeleteConfirm: () => void;
  getLocationName: (id: number) => string;
  activeTab?: "regular" | "recurring";
  onTabChange?: (tab: "regular" | "recurring") => void;
}

export function ExpenseTable({
  expenses,
  columnsVisible,
  onSort,
  onEdit,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  editingExpense,
  onEditSubmit,
  onDeleteConfirm,
  activeTab = "regular",
  onTabChange,
  getLocationName,
}: ExpenseTableProps) {
  const { locations } = useLocations();

  if (!expenses || expenses.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        No expenses found.
      </div>
    );
  }

  // Separate expenses into regular and recurring
  const regularExpenses = expenses.filter((expense) => !expense.isRecurring);
  const recurringExpenses = expenses.filter((expense) => expense.isRecurring);

  const handleTabChange = (value: string) => {
    onTabChange?.(value as "regular" | "recurring");
  };

  // Calculate status for recurring expenses
  const getRecurringExpenseStatus = (expense: Expense) => {
    if (!expense.recurringEndDate) return "Ongoing";
    const endDate = new Date(expense.recurringEndDate);
    const now = new Date();

    if (now > endDate) return "Ended";

    const daysRemaining = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${daysRemaining}d remaining`;
  };

  const getTotalAmount = (expenses: Expense[]) => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular" className="space-x-2">
            <span>Regular Expenses</span>
            <Badge variant="secondary">{regularExpenses.length}</Badge>
            <Badge variant="outline">
              {formatCurrency(getTotalAmount(regularExpenses))}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="recurring" className="space-x-2">
            <span>Recurring Expenses</span>
            <Badge variant="secondary">{recurringExpenses.length}</Badge>
            <Badge variant="outline">
              {formatCurrency(getTotalAmount(recurringExpenses))}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regular">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <ExpenseTableHeader
                columnsVisible={columnsVisible}
                onSort={onSort}
                showRecurringColumns={false}
              />
              <TableBody>
                {regularExpenses.map((expense) => (
                  <ExpenseTableRow
                    key={expense.id}
                    expense={expense}
                    columnsVisible={columnsVisible}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    getLocationName={getLocationName}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="recurring">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <ExpenseTableHeader
                columnsVisible={columnsVisible}
                onSort={onSort}
                showRecurringColumns={true}
              />
              <TableBody>
                {recurringExpenses.map((expense) => (
                  <ExpenseTableRow
                    key={expense.id}
                    expense={expense}
                    columnsVisible={columnsVisible}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    recurringStatus={getRecurringExpenseStatus(expense)}
                    getLocationName={getLocationName}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {editingExpense && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Edit {editingExpense.isRecurring ? "Recurring " : ""}Expense
              </DialogTitle>
              <DialogDescription>
                Make changes to your{" "}
                {editingExpense.isRecurring ? "recurring " : ""}expense here.
              </DialogDescription>
            </DialogHeader>
            <ExpenseForm
              initialData={editingExpense}
              onSubmit={onEditSubmit}
              locations={locations}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {editingExpense && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Delete {editingExpense.isRecurring ? "Recurring " : ""}Expense
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this expense of{" "}
                {formatCurrency(editingExpense.amount)}
                {editingExpense.name ? ` for "${editingExpense.name}"` : ""}?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={onDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
