"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Employee,
  EmployeeTableHeaderProps,
  COLUMNS,
  SortDirection,
} from "@/types/dashboard/business/employee";
import { Button } from "@/components/ui/button";

export function EmployeeTableHeader({
  columnsVisible,
  onSort,
  sortColumn,
  sortDirection,
}: EmployeeTableHeaderProps & {
  sortColumn: keyof Employee | null;
  sortDirection: SortDirection;
}) {
  const renderSortIcon = (columnKey: keyof Employee) => {
    if (sortColumn !== columnKey)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const renderSortableHeader = (columnKey: keyof Employee, label: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{label}</span>
          {renderSortIcon(columnKey)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => onSort(columnKey)}>
          Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort(columnKey)}>
          Sort Descending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map((column) =>
          columnsVisible[column.key] ? (
            <TableHead key={column.key} className={column.width}>
              {column.sortable
                ? renderSortableHeader(column.key, column.label)
                : column.label}
            </TableHead>
          ) : null
        )}
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
