"use client";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define the columns configuration
export const EXPENSE_COLUMNS = [
  { key: "id" as const, label: "ID" },
  { key: "name" as const, label: "Name" },
  { key: "amount" as const, label: "Amount" },
  { key: "location" as const, label: "Location" },
  { key: "frequency" as const, label: "Frequency" },
  { key: "expenseDate" as const, label: "Date" },
] as const;

// Type for column visibility
export type ExpenseColumnsVisible = {
  [K in (typeof EXPENSE_COLUMNS)[number]["key"]]: boolean;
};

// Props interface
export interface ExpenseTableSettingsProps {
  columnsVisible: ExpenseColumnsVisible;
  onColumnVisibilityChange: (
    column: keyof ExpenseColumnsVisible,
    visible: boolean
  ) => void;
}

export function ExpenseTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: ExpenseTableSettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {EXPENSE_COLUMNS.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.key}
            checked={columnsVisible[column.key]}
            onCheckedChange={(checked) =>
              onColumnVisibilityChange(column.key, checked)
            }
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
