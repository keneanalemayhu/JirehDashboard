"use client";

import { Button } from "@/components/ui/button";
import {
  Settings2,
  Building2,
  DollarSign,
  FileText,
  Calendar,
  Tag,
  CreditCard,
  Receipt,
  CheckCircle2,
  Clock,
  RefreshCw,
  LayoutGrid,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnVisibility } from "@/types/dashboard/business/retail/owner/expense";

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
  showWhen?: "always" | "recurringOnly";
}

const COLUMN_GROUPS: ColumnGroup[] = [
  {
    name: "Basic Information",
    icon: LayoutGrid,
    columns: [
      { key: "id", label: "ID" },
      { key: "locationId", label: "Location", icon: Building2 },
      { key: "name", label: "Name", icon: Tag },
      { key: "amount", label: "Amount", icon: DollarSign },
      { key: "description", label: "Description", icon: FileText },
    ],
    showWhen: "always",
  },
  {
    name: "Expense Details",
    icon: Calendar,
    columns: [
      { key: "expenseDate", label: "Date", icon: Calendar },
      { key: "paymentMethod", label: "Payment Method", icon: CreditCard },
      { key: "receiptNumber", label: "Receipt Number", icon: Receipt },
    ],
    showWhen: "always",
  },
  {
    name: "Status Information",
    icon: AlertCircle,
    columns: [
      { key: "approvalStatus", label: "Approval Status", icon: CheckCircle2 },
    ],
    showWhen: "always",
  },
  {
    name: "Recurring Settings",
    icon: RefreshCw,
    columns: [
      { key: "recurringFrequency", label: "Frequency", icon: Clock },
      { key: "recurringEndDate", label: "End Date", icon: Calendar },
      { key: "recurringStatus", label: "Status", icon: AlertCircle },
    ],
    showWhen: "recurringOnly",
  },
];

interface ExpenseTableSettingsProps {
  columnsVisible: ColumnVisibility;
  onColumnVisibilityChange: (column: ColumnKey, visible: boolean) => void;
  showRecurringColumns?: boolean;
}

export function ExpenseTableSettings({
  columnsVisible,
  onColumnVisibilityChange,
  showRecurringColumns = false,
}: ExpenseTableSettingsProps) {
  // Filter column groups based on current view
  const visibleGroups = COLUMN_GROUPS.filter(
    (group) =>
      group.showWhen === "always" ||
      (group.showWhen === "recurringOnly" && showRecurringColumns)
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

// Export types for use in other components
export type { ColumnKey };
export { COLUMN_GROUPS };