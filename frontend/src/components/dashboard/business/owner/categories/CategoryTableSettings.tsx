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
  CategoryTableSettingsProps,
  COLUMNS,
} from "@/types/dashboard/business/category";

// Group definitions for better organization
const COLUMN_GROUPS = [
  {
    label: "Basic Information",
    columns: ["id", "businessId", "locationId", "name", "description"],
  },
  {
    label: "Status",
    columns: ["isActive", "isHidden"],
  },
  {
    label: "Metadata",
    columns: ["createdBy", "createdAt", "updatedAt"],
  },
] as const;

export function CategoryTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: CategoryTableSettingsProps) {
  const getColumnLabel = (key: string) => {
    const column = COLUMNS.find((col) => col.key === key);
    return column?.label || key;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8 lg:flex">
          <Settings2 className="mr-2 h-4 w-4" />
          View
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {COLUMN_GROUPS.map((group, index) => (
          <div key={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="font-normal text-xs uppercase text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.columns.map((columnKey) => (
              <DropdownMenuCheckboxItem
                key={columnKey}
                checked={columnsVisible[columnKey]}
                onCheckedChange={(checked) =>
                  onColumnVisibilityChange(columnKey, checked)
                }
                className="capitalize"
              >
                {getColumnLabel(columnKey)}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
