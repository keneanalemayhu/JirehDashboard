"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  EmployeeTableProps,
  EmployeeFormData,
} from "@/types/dashboard/business/employee";
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
  getLocationName,
  locations,
}: EmployeeTableProps) {
  if (!employees) {
    return (
      <div className="rounded-lg border p-4 text-center text-gray-500">
        Loading employees...
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-center text-gray-500">
        No employees found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <EmployeeTableHeader
            columnsVisible={columnsVisible}
            onSort={onSort} sortColumn={null} sortDirection={null}          />
          <TableBody>
            {employees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                columnsVisible={columnsVisible}
                onEdit={onEdit}
                onDelete={onDelete}
                getLocationName={getLocationName}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Make changes to the employee information below.
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <EmployeeForm
              initialData={editingEmployee}
              onSubmit={(data: EmployeeFormData) => {
                onEditSubmit(data);
                setIsEditDialogOpen(false);
              } }
              locations={locations} // Pass locations prop here
              sortColumn={null} sortDirection={null}            />
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
            <Button
              variant="destructive"
              onClick={() => {
                onDeleteConfirm();
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
