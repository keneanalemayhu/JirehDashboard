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

type ColumnKey =
  | "id"
  | "name"
  | "price"
  | "category"
  | "barcode"
  | "quantity"
  | "isActive"
  | "isHidden";

interface ColumnVisibility {
  id: boolean;
  name: boolean;
  price: boolean;
  category: boolean;
  barcode: boolean;
  quantity: boolean;
  isActive: boolean;
  isHidden: boolean;
}

interface ItemTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: ColumnKey, visible: boolean) => void;
}

interface ColumnItem {
  key: ColumnKey;
  label: string;
}

interface ColumnGroup {
  name: string;
  columns: ColumnItem[];
}

const COLUMN_GROUPS: ColumnGroup[] = [
  {
    name: "Basic Information",
    columns: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price" },
      { key: "category", label: "Category" },
    ],
  },
  {
    name: "Inventory Details",
    columns: [
      { key: "barcode", label: "Barcode" },
      { key: "quantity", label: "Quantity" },
    ],
  },
  {
    name: "Status Information",
    columns: [
      { key: "isActive", label: "Status" },
      { key: "isHidden", label: "Visibility" },
    ],
  },
];

export function ItemTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
}: ItemTableSettingsProps) {
  if (!columnsVisible) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {COLUMN_GROUPS.map((group, groupIndex) => (
          <div key={group.name}>
            <DropdownMenuLabel className="font-bold">
              {group.name}
            </DropdownMenuLabel>
            {group.columns.map((column) => (
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
            {groupIndex < COLUMN_GROUPS.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
