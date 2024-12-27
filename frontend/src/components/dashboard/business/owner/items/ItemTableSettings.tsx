"use client";

import { Button } from "@/components/ui/button";
import {
  Settings2,
  Clock,
  AlertCircle,
  Barcode,
  Package2,
  LayoutGrid,
} from "lucide-react";
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
  categoryId: boolean; // Updated from category to categoryId
  barcode: boolean;
  quantity: boolean;
  isActive: boolean;
  isHidden: boolean;
  isTemporary: boolean;
  expiryHours: boolean;
  autoResetQuantity: boolean;
  temporaryStatus: boolean;
};

const DEFAULT_COLUMNS_VISIBLE: ColumnVisibility = {
  id: true,
  name: true,
  price: true,
  categoryId: true, // Updated from category to categoryId
  barcode: true,
  quantity: true,
  isActive: true,
  isHidden: true,
  isTemporary: true,
  expiryHours: true,
  autoResetQuantity: true,
  temporaryStatus: true,
};

type ColumnKey = keyof ColumnVisibility;

interface ColumnItem {
  key: ColumnKey;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface ColumnGroup {
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  columns: ColumnItem[];
  showWhen?: "always" | "temporaryOnly";
}

const COLUMN_GROUPS: ColumnGroup[] = [
  {
    name: "Basic Information",
    icon: LayoutGrid,
    columns: [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "price", label: "Price" },
      { key: "categoryId", label: "Category" }, // Updated from category to categoryId
    ],
    showWhen: "always",
  },
  {
    name: "Inventory Details",
    icon: Package2,
    columns: [
      { key: "barcode", label: "Barcode", icon: Barcode },
      { key: "quantity", label: "Quantity" },
    ],
    showWhen: "always",
  },
  {
    name: "Status Information",
    icon: AlertCircle,
    columns: [
      { key: "isActive", label: "Status" },
      { key: "isHidden", label: "Visibility" },
      { key: "isTemporary", label: "Temporary Flag", icon: Clock },
    ],
    showWhen: "always",
  },
  {
    name: "Temporary Item Settings",
    icon: Clock,
    columns: [
      { key: "expiryHours", label: "Expiry Hours", icon: Clock },
      { key: "autoResetQuantity", label: "Auto Reset" },
      { key: "temporaryStatus", label: "Time Status", icon: AlertCircle },
    ],
    showWhen: "temporaryOnly",
  },
];

interface ItemTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: ColumnKey, visible: boolean) => void;
  showTemporaryColumns?: boolean;
}

export function ItemTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
  showTemporaryColumns = false,
}: ItemTableSettingsProps) {
  // Filter column groups based on current view
  const visibleGroups = COLUMN_GROUPS.filter(
    (group) =>
      group.showWhen === "always" ||
      (group.showWhen === "temporaryOnly" && showTemporaryColumns)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Toggle column visibility</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {visibleGroups.map((group, groupIndex) => (
          <div key={group.name}>
            <DropdownMenuLabel className="font-bold flex items-center gap-2">
              {group.icon && <group.icon className="h-4 w-4" />}
              {group.name}
            </DropdownMenuLabel>
            {group.columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={columnsVisible[column.key]}
                onCheckedChange={(checked) =>
                  onColumnVisibilityChange(column.key, checked)
                }
                className="capitalize flex items-center gap-2"
              >
                {column.icon && <column.icon className="h-4 w-4" />}
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
            {groupIndex < visibleGroups.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export for use in other components
export type { ColumnVisibility, ColumnKey };
export { DEFAULT_COLUMNS_VISIBLE, COLUMN_GROUPS };
