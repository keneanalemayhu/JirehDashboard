"use client";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmployeeTableSettingsProps,
  COLUMNS,
} from "@/types/dashboard/business/retail/owner/employee";

export function EmployeeTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: EmployeeTableSettingsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {COLUMNS.map((column) => (
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
