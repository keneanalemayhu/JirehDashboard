"use client";

import { Table, TableBody } from "@/components/ui/table";
import { Employee } from "@/types/dashboard/business/retail/owner/employee"; // You'll need to create this type
import { EmployeeTableHeader } from "./EmployeeTableHeader";
import { EmployeeTableRow } from "./EmployeeTableRow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmployeeForm } from "./EmployeeForm";

interface EmployeeTableProps {
  employees: Employee[];
  columnsVisible: {
    id: boolean;
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    department: boolean;
    position: boolean;
  };
  onSort: (column: keyof Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingEmployee: Employee | null;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export function EmployeeTable({
  employees,
  columnsVisible,
  onSort,
  onEdit,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  editingEmployee,
  onEditSubmit,
  onDeleteConfirm,
}: EmployeeTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <EmployeeTableHeader
            columnsVisible={columnsVisible}
            onSort={onSort}
          />
          <TableBody>
            {employees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
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
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Make changes to the employee details.
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <EmployeeForm
              initialData={editingEmployee}
              onSubmit={onEditSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot
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
