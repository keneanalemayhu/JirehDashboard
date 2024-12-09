"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Employee, EmployeeStatus } from "@/types/dashboard/owner/employee";
import { cn } from "@/lib/utils";

interface EmployeeTableRowProps {
  employee: Employee;
  columnsVisible: {
    id: boolean;
    name: boolean;
    phone: boolean;
    salary: boolean;
    status: boolean;
    location: boolean;
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
  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.FULL_TIME:
        return "bg-green-100 text-green-800";
      case EmployeeStatus.PART_TIME:
        return "bg-blue-100 text-blue-800";
      case EmployeeStatus.CONTRACT:
        return "bg-orange-100 text-orange-800";
      case EmployeeStatus.INTERN:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TableRow className={!employee.isActive ? "opacity-50" : ""}>
      {columnsVisible.id && <TableCell>{employee.id}</TableCell>}
      {columnsVisible.name && <TableCell>{employee.name}</TableCell>}
      {columnsVisible.phone && <TableCell>{employee.phone}</TableCell>}
      {columnsVisible.salary && (
        <TableCell className="text-right">
          {employee.salary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </TableCell>
      )}
      {columnsVisible.status && (
        <TableCell>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(employee.status)
            )}
          >
            {employee.status}
          </span>
        </TableCell>
      )}
      {columnsVisible.location && (
        <TableCell>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {employee.location}
          </span>
        </TableCell>
      )}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {employee.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(employee)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {employee.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
