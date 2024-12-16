"use client";

import { Table, TableBody } from "@/components/ui/table";
import { ExpenseTableHeader } from "./ExpenseTableHeader";
import { ExpenseTableRow } from "./ExpenseTableRow";
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
import {
  Expense,
  ExpenseTableProps,
} from "@/types/dashboard/business/retail/owner/expense";

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
}: ExpenseTableProps) {
  if (!expenses) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        Loading expenses...
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        No expenses found.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <ExpenseTableHeader columnsVisible={columnsVisible} onSort={onSort} />
          <TableBody>
            {expenses.map((expense) => (
              <ExpenseTableRow
                key={expense.id}
                expense={expense}
                columnsVisible={columnsVisible}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Make changes to the expense details.
            </DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <ExpenseForm initialData={editingExpense} onSubmit={onEditSubmit} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
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
    </div>
  );
}
