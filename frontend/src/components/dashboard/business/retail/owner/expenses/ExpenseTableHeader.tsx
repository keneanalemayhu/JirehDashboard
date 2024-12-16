"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";

interface Expense {
  id: number;
  name: string;
  amount: number;
  location: string;
  expenseDate: string;
  frequency:
    | "One-time"
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Quarterly"
    | "Yearly";
}

interface ExpenseTableHeaderProps {
  columnsVisible: {
    id: boolean;
    name: boolean;
    amount: boolean;
    location: boolean;
    expenseDate: boolean;
    frequency: boolean;
  };
  onSort: (column: keyof Expense) => void;
}

type ColumnConfig = {
  key: keyof Expense;
  label: string;
  width?: string;
  align?: string;
};

export function ExpenseTableHeader({
  columnsVisible,
  onSort,
}: ExpenseTableHeaderProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", width: "w-[100px]" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount", width: "w-[150px]", align: "text-right" },
    { key: "location", label: "Location" },
    { key: "frequency", label: "Frequency", width: "w-[120px]" },
    { key: "expenseDate", label: "Date", width: "w-[150px]" },
  ];

  const renderSortableHeader = (column: ColumnConfig) => (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center ${column.align || ""}`}
      >
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
            <TableHead
              key={column.key}
              className={`${column.width || ""} ${column.align || ""}`}
            >
              {renderSortableHeader(column)}
            </TableHead>
          ) : null
        )}
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
