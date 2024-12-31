"use client";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmployeeTableSettingsProps,
  COLUMNS,
  Employee,
} from "@/types/dashboard/business/employee";

// Group columns by category for better organization
const COLUMN_GROUPS = {
  "Basic Info": ["id", "name", "email", "phone"],
  "Employment Details": [
    "position",
    "salary",
    "status",
    "employmentStatus",
    "hireDate",
  ],
  Organization: ["locationId", "businessId"],
  System: ["isActive", "createdAt", "updatedAt"],
} as const;

export function EmployeeTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: EmployeeTableSettingsProps) {
  // Count visible columns to prevent hiding all columns
  const visibleColumnCount =
    Object.values(columnsVisible).filter(Boolean).length;

  const handleVisibilityChange = (key: keyof Employee, checked: boolean) => {
    // Prevent hiding the last visible column
    if (!checked && visibleColumnCount <= 1) {
      return;
    }
    onColumnVisibilityChange(key, checked);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Column settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {Object.entries(COLUMN_GROUPS).map(([group, columnKeys]) => (
          <div key={group}>
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              {group}
            </DropdownMenuLabel>
            {columnKeys.map((key) => {
              const column = COLUMNS.find((col) => col.key === key);
              if (!column) return null;

              return (
                <DropdownMenuCheckboxItem
                  key={column.key}
                  checked={columnsVisible[column.key]}
                  onCheckedChange={(checked) =>
                    handleVisibilityChange(column.key, checked)
                  }
                  disabled={
                    columnsVisible[column.key] && visibleColumnCount <= 1
                  }
                  className="text-sm"
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              );
            })}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
