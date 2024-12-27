"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronsUpDownIcon,
  Clock,
  RefreshCw,
  Calendar,
  CreditCard,
  Receipt,
  CheckCircle2,
  Building2,
  DollarSign,
  FileText,
  Tag,
} from "lucide-react";
import {
  ColumnConfig,
  ColumnKey,
  Expense,
  ColumnVisibility,
  SortDirection,
} from "@/types/dashboard/business/expense";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DEFAULT_COLUMN_CONFIG: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[80px]", sortable: true },
  {
    key: "locationId",
    label: "Location",
    width: "w-[150px]",
    sortable: true,
    icon: Building2,
  },
  {
    key: "name",
    label: "Name",
    width: "w-[200px]",
    sortable: true,
    icon: Tag,
  },
  {
    key: "amount",
    label: "Amount",
    width: "w-[120px]",
    sortable: true,
    icon: DollarSign,
  },
  {
    key: "description",
    label: "Description",
    width: "w-[200px]",
    sortable: true,
    icon: FileText,
  },
  {
    key: "expenseDate",
    label: "Date",
    width: "w-[120px]",
    sortable: true,
    icon: Calendar,
  },
  {
    key: "paymentMethod",
    label: "Payment",
    width: "w-[120px]",
    sortable: true,
    icon: CreditCard,
  },
  {
    key: "receiptNumber",
    label: "Receipt #",
    width: "w-[120px]",
    sortable: true,
    icon: Receipt,
  },
  {
    key: "approvalStatus",
    label: "Status",
    width: "w-[100px]",
    sortable: true,
    icon: CheckCircle2,
  },
];

export const RECURRING_COLUMNS: ColumnConfig[] = [
  {
    key: "recurringFrequency",
    label: "Frequency",
    width: "w-[120px]",
    sortable: true,
    icon: Clock,
  },
  {
    key: "recurringEndDate",
    label: "End Date",
    width: "w-[120px]",
    sortable: true,
    icon: Calendar,
  },
  {
    key: "recurringStatus",
    label: "Status",
    width: "w-[130px]",
    sortable: true,
    icon: RefreshCw,
  },
];

interface ExpenseTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Expense) => void;
  sortColumn?: keyof Expense | null;
  sortDirection?: SortDirection;
  showRecurringColumns?: boolean;
}

export function ExpenseTableHeader({
  columnsVisible,
  onSort,
  sortColumn,
  sortDirection,
  showRecurringColumns = false,
}: ExpenseTableHeaderProps) {
  const columns = [
    ...DEFAULT_COLUMN_CONFIG,
    ...(showRecurringColumns ? RECURRING_COLUMNS : []),
  ];

  const renderColumnHeader = (column: ColumnConfig) => {
    const headerContent = (
      <div className="flex items-center space-x-2">
        {column.icon && <column.icon className="h-4 w-4" />}
        <span>{column.label}</span>
      </div>
    );

    if (column.sortable) {
      const isActive = sortColumn === column.key;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center group">
            {headerContent}
            <ChevronsUpDownIcon
              className={`ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                isActive ? "opacity-100 text-primary" : ""
              }`}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={() => onSort(column.key as keyof Expense)}
              className={
                sortColumn === column.key && sortDirection === "asc"
                  ? "bg-accent"
                  : ""
              }
            >
              Sort Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSort(column.key as keyof Expense)}
              className={
                sortColumn === column.key && sortDirection === "desc"
                  ? "bg-accent"
                  : ""
              }
            >
              Sort Descending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (column.icon) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center">
              {headerContent}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{column.label}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return headerContent;
  };

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) =>
          columnsVisible[column.key] !== false ? (
            <TableHead
              key={column.key}
              className={`${column.width} ${
                !column.sortable ? "text-center" : ""
              }`}
            >
              {renderColumnHeader(column)}
            </TableHead>
          ) : null
        )}
        <TableHead className="w-[100px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
