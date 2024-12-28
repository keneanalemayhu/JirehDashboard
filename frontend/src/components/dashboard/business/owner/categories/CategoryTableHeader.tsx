"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import {
  Category,
  ColumnVisibility,
  ColumnConfig,
  COLUMNS,
} from "@/types/dashboard/business/category";

interface CategoryTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Category) => void;
}

export function CategoryTableHeader({
  columnsVisible,
  onSort,
}: CategoryTableHeaderProps) {
  const renderSortableHeader = (column: ColumnConfig) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        {column.label}
        <ArrowUpDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
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
        {COLUMNS.map((column) =>
          columnsVisible[column.key] ? (
            <TableHead key={column.key} className={column.width}>
              {column.sortable !== false
                ? renderSortableHeader(column)
                : column.label}
            </TableHead>
          ) : null
        )}
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
