"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDownIcon } from "lucide-react";

type ColumnKey =
  | "id"
  | "name"
  | "price"
  | "category"
  | "barcode"
  | "quantity"
  | "isActive"
  | "isHidden";

interface ColumnVisibility {
  id: boolean;
  name: boolean;
  price: boolean;
  category: boolean;
  barcode: boolean;
  quantity: boolean;
  isActive: boolean;
  isHidden: boolean;
}

interface Column {
  key: ColumnKey;
  label: string;
  width: string;
  sortable: boolean;
}

interface ItemTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: ColumnKey) => void;
}

const COLUMNS: Column[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "name", label: "Name", width: "w-[200px]", sortable: true },
  { key: "barcode", label: "Barcode", width: "w-[150px]", sortable: true },
  { key: "price", label: "Price", width: "w-[100px]", sortable: true },
  { key: "quantity", label: "Quantity", width: "w-[100px]", sortable: true },
  { key: "category", label: "Category", width: "w-[150px]", sortable: true },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: false },
  { key: "isHidden", label: "Visibility", width: "w-[100px]", sortable: false },
];

export function ItemTableHeader({
  columnsVisible,
  onSort,
}: ItemTableHeaderProps) {
  if (!columnsVisible) {
    return null;
  }

  const renderSortableHeader = (column: Column) => {
    if (!column.sortable) {
      return column.label;
    }

    return (
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
  };

  return (
    <TableHeader>
      <TableRow>
        {COLUMNS.map((column) =>
          columnsVisible[column.key] ? (
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
