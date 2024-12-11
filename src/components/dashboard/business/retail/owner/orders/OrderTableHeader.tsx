"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDownIcon } from "lucide-react";

interface Order {
  order_id: string;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  employee_name: string;
  user_name: string;
  total_amount: number;
  payment_status: "PENDING" | "PAID" | "CANCELLED";
}

interface OrderTableHeaderProps {
  onSort: (column: keyof Order) => void;
}

type ColumnConfig = {
  key: keyof Order;
  label: string;
  width?: string;
};

export function OrderTableHeader({ onSort }: OrderTableHeaderProps) {
  const columns: ColumnConfig[] = [
    { key: "order_id", label: "Order ID", width: "w-[120px]" },
    { key: "item_name", label: "Item" },
    { key: "quantity", label: "Quantity", width: "w-[100px]" },
    { key: "unit_price", label: "Unit Price", width: "w-[120px]" },
    { key: "subtotal", label: "Subtotal", width: "w-[120px]" },
    { key: "employee_name", label: "Employee" },
    { key: "user_name", label: "Seller" },
    { key: "total_amount", label: "Total Amount", width: "w-[120px]" },
    { key: "payment_status", label: "Payment Status", width: "w-[130px]" },
  ];

  const renderSortableHeader = (column: ColumnConfig) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        {column.label}
        <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onSort(column.key)}>
          Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSort(column.key)}>
          Sort Descending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead key={column.key} className={column.width}>
            {renderSortableHeader(column)}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
