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
  Location,
  ColumnVisibility,
  SortDirection,
  COLUMNS,
} from "@/types/dashboard/business/location";

interface LocationTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Location) => void;
  sortColumn?: keyof Location | null;
  sortDirection?: SortDirection;
}

export function LocationTableHeader({
  columnsVisible,
  onSort,
  sortColumn,
  sortDirection,
}: LocationTableHeaderProps) {
  const renderSortableHeader = (column: (typeof COLUMNS)[number]) => {
    if (!column.sortable) {
      return <span className="flex items-center">{column.label}</span>;
    }

    const isActive = sortColumn === column.key;
    let SortIcon = ArrowUpDown;
    if (isActive) {
      SortIcon = sortDirection === "asc" ? ArrowUp : ArrowDown;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center group">
          {column.label}
          <SortIcon
            className={`ml-2 h-4 w-4 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } transition-opacity`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => onSort(column.key as keyof Location)}
            className={
              sortColumn === column.key && sortDirection === "asc"
                ? "bg-accent"
                : ""
            }
          >
            Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSort(column.key as keyof Location)}
            className={
              sortColumn === column.key && sortDirection === "desc"
                ? "bg-accent"
                : ""
            }
          >
            Sort Descending
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map((column) =>
          columnsVisible[column.key as keyof ColumnVisibility] ? (
            <TableHead
              key={column.key}
              className={`${column.width || ""} ${column.align || ""}`}
            >
              {renderSortableHeader(column)}
            </TableHead>
          ) : null
        )}
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
