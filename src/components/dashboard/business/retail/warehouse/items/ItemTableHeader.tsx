// ItemTableHeader.tsx
"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDownIcon } from "lucide-react";
import { ColumnConfig } from "@/types/dashboard/business/retail/owner/item";

export const DEFAULT_COLUMN_CONFIG: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "name", label: "Name", width: "w-[200px]", sortable: true },
  { key: "barcode", label: "Barcode", width: "w-[150px]", sortable: true },
  { key: "price", label: "Price", width: "w-[100px]", sortable: true },
  { key: "quantity", label: "Quantity", width: "w-[100px]", sortable: true },
  { key: "category", label: "Category", width: "w-[150px]", sortable: true },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: false },
  { key: "isHidden", label: "Visibility", width: "w-[100px]", sortable: false },
];

interface ItemTableHeaderProps {
  columnsVisible: Record<string, boolean>;
  onSort: (columnKey: keyof (typeof DEFAULT_COLUMN_CONFIG)[0]) => void;
  sortColumn?: string | null;
  sortDirection?: "asc" | "desc" | null;
}

export function ItemTableHeader({
  columnsVisible = {},
  onSort,
  sortColumn,
  sortDirection,
}: ItemTableHeaderProps) {
  const renderSortableHeader = (column: ColumnConfig) => {
    if (!column.sortable) {
      return column.label;
    }

    const isActive = sortColumn === column.key;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center">
          {column.label}
          <ChevronsUpDownIcon
            className={`ml-2 h-4 w-4 ${isActive ? "text-primary" : ""}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => onSort(column.key)}
            className={
              sortColumn === column.key && sortDirection === "asc"
                ? "bg-accent"
                : ""
            }
          >
            Sort Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onSort(column.key)}
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
        {DEFAULT_COLUMN_CONFIG.map((column) =>
          columnsVisible[column.key] !== false ? (
            <TableHead
              key={column.key}
              className={`${column.width} ${
                !column.sortable ? "text-center" : ""
              }`}
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
