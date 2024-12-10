"use client";

import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Item } from "@/types/dashboard/business/retail/owner/item";

interface ItemTableSettingsProps {
  columnsVisible: {
    id: boolean;
    name: boolean;
    price: boolean;
    category: boolean;
  };
  onColumnVisibilityChange: (
    column: keyof Omit<Item, "isHidden">,
    visible: boolean
  ) => void;
}

type ColumnConfig = {
  key: keyof Omit<Item, "isHidden">;
  label: string;
};

export function ItemTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: ItemTableSettingsProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "price", label: "Price" },
    { key: "category", label: "Category" },
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
