"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDownIcon } from "lucide-react";
import { Employee } from "@/types/dashboard/admin/employee";

interface EmployeeTableHeaderProps {
  columnsVisible: {
    id: boolean;
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    department: boolean;
    position: boolean;
  };
  onSort: (column: keyof Employee) => void;
}

type ColumnConfig = {
  key: keyof Omit<Employee, "isActive">;
  label: string;
  width?: string;
};

export function EmployeeTableHeader({
  columnsVisible,
  onSort,
}: EmployeeTableHeaderProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", width: "w-[100px]" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
  ];

  const renderSortableHeader = (column: ColumnConfig) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {column.label}
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSort(column.key)}>
          Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort(column.key)}>
          Sort Descending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) =>
          columnsVisible[column.key] ? (
            <TableHead key={column.key} className={column.width}>
              {renderSortableHeader(column)}
            </TableHead>
          ) : null
        )}
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
