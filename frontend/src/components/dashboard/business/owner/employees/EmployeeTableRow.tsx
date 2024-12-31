"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  EmployeeStatus,
  EmployeeTableRowProps,
} from "@/types/dashboard/business/employee";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function EmployeeTableRow({
  employee,
  columnsVisible,
  onEdit,
  onDelete,
  getLocationName,
}: EmployeeTableRowProps) {
  const getStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.FULL_TIME:
        return "bg-green-100 text-green-800 border-green-200";
      case EmployeeStatus.PART_TIME:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case EmployeeStatus.CONTRACT:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case EmployeeStatus.INTERN:
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <TableRow
      className={cn("transition-opacity", !employee.isActive && "opacity-60")}
    >
      {columnsVisible.id && (
        <TableCell className="font-medium">{employee.id}</TableCell>
      )}
      {columnsVisible.locationId && (
        <TableCell>{getLocationName(employee.locationId)}</TableCell>
      )}
      {columnsVisible.name && <TableCell>{employee.name}</TableCell>}
      {columnsVisible.email && <TableCell>{employee.email}</TableCell>}
      {columnsVisible.phone && <TableCell>{employee.phone}</TableCell>}
      {columnsVisible.position && <TableCell>{employee.position}</TableCell>}
      {columnsVisible.salary && (
        <TableCell className="text-right">
          {formatCurrency(employee.salary)}
        </TableCell>
      )}
      {columnsVisible.status && (
        <TableCell>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border",
              getStatusColor(employee.status)
            )}
          >
            {employee.status}
          </span>
        </TableCell>
      )}
      {columnsVisible.employmentStatus && (
        <TableCell>
          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {employee.employmentStatus}
          </span>
        </TableCell>
      )}
      {columnsVisible.hireDate && (
        <TableCell>
          {format(new Date(employee.hireDate), "MMM d, yyyy")}
        </TableCell>
      )}
      {columnsVisible.isActive && (
        <TableCell>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              employee.isActive
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-red-100 text-red-800 border-red-200"
            )}
          >
            {employee.isActive ? "Active" : "Inactive"}
          </span>
        </TableCell>
      )}
      {columnsVisible.createdAt && (
        <TableCell>
          {format(new Date(employee.createdAt), "MMM d, yyyy")}
        </TableCell>
      )}
      {columnsVisible.updatedAt && (
        <TableCell>
          {format(new Date(employee.updatedAt), "MMM d, yyyy")}
        </TableCell>
      )}

      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(employee)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit {employee.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(employee)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {employee.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
