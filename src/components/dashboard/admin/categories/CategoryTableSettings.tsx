"use client";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types/dashboard/admin/category";

interface CategoryTableSettingsProps {
  columnsVisible: {
    id: boolean;
    name: boolean;
    description: boolean;
    location: boolean;
  };
  onColumnVisibilityChange: (
    column: keyof Omit<Category, "isHidden">,
    visible: boolean
  ) => void;
}

type ColumnConfig = {
  key: keyof Omit<Category, "isHidden">;
  label: string;
};

export function CategoryTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: CategoryTableSettingsProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "location", label: "Location" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {columns.map((column) => (
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
