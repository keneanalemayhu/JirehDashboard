"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDownIcon } from "lucide-react";
import { Location } from "@/types/dashboard/owner/location";

interface LocationTableHeaderProps {
  columnsVisible: {
    id: boolean;
    name: boolean;
    address: boolean;
    phoneNumber: boolean;
  };
  onSort: (column: keyof Location) => void;
}

type ColumnConfig = {
  key: keyof Location;
  label: string;
  width?: string;
};

export function LocationTableHeader({
  columnsVisible,
  onSort,
}: LocationTableHeaderProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", width: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "phoneNumber", label: "Phone Number" },
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
          columnsVisible[column.key as keyof typeof columnsVisible] ? (
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
