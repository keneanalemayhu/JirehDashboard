"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Employee } from "@/types/dashboard/admin/employee";

interface EmployeeTableRowProps {
  employee: Employee;
  columnsVisible: {
    id: boolean;
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    department: boolean;
    position: boolean;
  };
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTableRow({
  employee,
  columnsVisible,
  onEdit,
  onDelete,
}: EmployeeTableRowProps) {
  return (
    <TableRow className={!employee.isActive ? "opacity-50" : ""}>
      {/* ID Column */}
      {columnsVisible.id && <TableCell>{employee.id}</TableCell>}

      {/* First Name Column */}
      {columnsVisible.firstName && <TableCell>{employee.firstName}</TableCell>}

      {/* Last Name Column */}
      {columnsVisible.lastName && <TableCell>{employee.lastName}</TableCell>}

      {/* Email Column */}
      {columnsVisible.email && <TableCell>{employee.email}</TableCell>}

      {/* Department Column */}
      {columnsVisible.department && (
        <TableCell>{employee.department}</TableCell>
      )}

      {/* Position Column */}
      {columnsVisible.position && <TableCell>{employee.position}</TableCell>}

      {/* Actions Column */}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">
              Edit {employee.firstName} {employee.lastName}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(employee)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">
              Delete {employee.firstName} {employee.lastName}
            </span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
