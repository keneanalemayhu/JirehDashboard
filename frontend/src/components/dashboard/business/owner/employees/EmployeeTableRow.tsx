"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Employee, EmployeeStatus } from "@/types/dashboard/business/employee";
import { cn } from "@/lib/utils";

interface EmployeeTableRowProps {
  employee: Employee;
  columnsVisible: {
    id: boolean;
    storeId: boolean;
    locationId: boolean;
    fullName: boolean;
    position: boolean;
    phone: boolean;
    email: boolean;
    hireDate: boolean;
    isActive: boolean;
    salary: boolean;
    employmentStatus: boolean;
    createdAt: boolean;
    updatedAt: boolean;
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
      {columnsVisible.storeId && <TableCell>{employee.storeId}</TableCell>}
      {columnsVisible.locationId && <TableCell>{employee.locationId}</TableCell>}
      {columnsVisible.fullName && <TableCell>{employee.fullName}</TableCell>}
      {columnsVisible.position && <TableCell>{employee.position}</TableCell>}
      {columnsVisible.phone && <TableCell>{employee.phone}</TableCell>}
      {columnsVisible.email && <TableCell>{employee.email}</TableCell>}
      {columnsVisible.hireDate && <TableCell>{employee.hireDate}</TableCell>}
      {columnsVisible.salary && (
        <TableCell className="text-right">
          {typeof employee.salary === 'number' 
            ? employee.salary.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : '0.00'
          }
        </TableCell>
      )}
      {columnsVisible.employmentStatus && (
        <TableCell>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(employee.employmentStatus)
            )}
          >
            {employee.employmentStatus}
          </span>
        </TableCell>
      )}
      {columnsVisible.createdAt && <TableCell>{employee.createdAt}</TableCell>}
      {columnsVisible.updatedAt && <TableCell>{employee.updatedAt}</TableCell>}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(employee)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {employee.fullName}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(employee)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {employee.fullName}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
