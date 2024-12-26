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
  ColumnVisibility,
  COLUMNS,
} from "@/types/dashboard/business/retail/owner/location";

interface LocationTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (
    column: keyof ColumnVisibility,
    visible: boolean
  ) => void;
}

export function LocationTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: LocationTableSettingsProps) {
  // Group our columns for better organization
  const columnGroups = [
    {
      name: "Basic Information",
      columns: COLUMNS.filter((col) =>
        ["id", "name"].includes(col.key as string)
      ),
    },
    {
      name: "Contact Details",
      columns: COLUMNS.filter((col) =>
        ["address", "contactNumber"].includes(col.key as string)
      ),
    },
    {
      name: "Status Information",
      columns: COLUMNS.filter((col) =>
        ["isActive", "updatedAt"].includes(col.key as string)
      ),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {columnGroups.map((group, index) => (
          <div key={group.name}>
            <DropdownMenuLabel className="font-bold">
              {group.name}
            </DropdownMenuLabel>
            {group.columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={columnsVisible[column.key as keyof ColumnVisibility]}
                onCheckedChange={(checked) =>
                  onColumnVisibilityChange(
                    column.key as keyof ColumnVisibility,
                    checked
                  )
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
            {index < columnGroups.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
