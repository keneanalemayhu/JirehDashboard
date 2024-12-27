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

type ColumnVisibility = {
  id: boolean;
  name: boolean;
  price: boolean;
  category: boolean;
  barcode: boolean;
  quantity: boolean;
  isActive: boolean;
  isHidden: boolean;
};

const DEFAULT_COLUMNS_VISIBLE: ColumnVisibility = {
  id: true,
  name: true,
  price: true,
  category: true,
  barcode: true,
  quantity: true,
  isActive: true,
  isHidden: true,
};

type ColumnKey = keyof ColumnVisibility;

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

interface ItemTableSettingsProps {
  columnsVisible?: Partial<ColumnVisibility>;
  onColumnVisibilityChange: (column: ColumnKey, visible: boolean) => void;
}

export function ItemTableSettings({
  columnsVisible = DEFAULT_COLUMNS_VISIBLE,
  onColumnVisibilityChange,
}: ItemTableSettingsProps) {
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
                checked={columnsVisible[column.key] ?? true}
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
