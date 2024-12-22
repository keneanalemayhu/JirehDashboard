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
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import {
  ColumnConfig,
  ColumnKey,
  Item,
  ColumnVisibility,
  SortDirection,
} from "@/types/dashboard/business/retail/owner/item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const DEFAULT_COLUMN_CONFIG: ColumnConfig[] = [
  { key: "id", label: "ID", width: "w-[100px]", sortable: true },
  { key: "name", label: "Name", width: "w-[200px]", sortable: true },
  { key: "barcode", label: "Barcode", width: "w-[150px]", sortable: true },
  { key: "price", label: "Price", width: "w-[100px]", sortable: true },
  { key: "quantity", label: "Quantity", width: "w-[100px]", sortable: true },
  { key: "categoryId", label: "Category", width: "w-[150px]", sortable: true },
  { key: "isActive", label: "Status", width: "w-[100px]", sortable: false },
  { key: "isHidden", label: "Visibility", width: "w-[100px]", sortable: false },
];

export const TEMPORARY_COLUMNS: ColumnConfig[] = [
  {
    key: "expiryHours",
    label: "Expiry Hours",
    width: "w-[120px]",
    sortable: true,
    icon: Clock,
  },
  {
    key: "autoResetQuantity",
    label: "Auto Reset",
    width: "w-[100px]",
    sortable: false,
    icon: RotateCcw,
  },
  {
    key: "temporaryStatus",
    label: "Time Status",
    width: "w-[130px]",
    sortable: true,
    icon: AlertCircle,
  },
];

interface ItemTableHeaderProps {
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Item) => void;
  sortColumn?: keyof Item | null;
  sortDirection?: SortDirection;
  showTemporaryColumns?: boolean;
}

export function ItemTableHeader({
  columnsVisible,
  onSort,
  sortColumn,
  sortDirection,
  showTemporaryColumns = false,
}: ItemTableHeaderProps) {
  const columns = [
    ...DEFAULT_COLUMN_CONFIG,
    ...(showTemporaryColumns ? TEMPORARY_COLUMNS : []),
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
              onClick={() => onSort(column.key as ColumnKey)}
              className={
                sortColumn === column.key && sortDirection === "asc"
                  ? "bg-accent"
                  : ""
              }
            >
              Sort Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSort(column.key as ColumnKey)}
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
