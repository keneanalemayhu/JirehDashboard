"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { Category } from "@/types/dashboard/business/retail/owner/category";

interface CategoryTableHeaderProps {
  columnsVisible: {
    id: boolean;
    name: boolean;
    description: boolean;
    location: boolean;
  };
  onSort: (column: keyof Category) => void;
}

type ColumnConfig = {
  key: keyof Omit<Category, "isHidden">;
  label: string;
  width?: string;
};

export function CategoryTableHeader({
  columnsVisible,
  onSort,
}: CategoryTableHeaderProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", width: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "location", label: "Location" },
  ];

  const renderSortableHeader = (column: ColumnConfig) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {column.label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
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
