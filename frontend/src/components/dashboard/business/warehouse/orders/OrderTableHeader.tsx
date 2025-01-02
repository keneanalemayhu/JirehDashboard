"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown } from "lucide-react";
import { Order } from "@/types/dashboard/business/order";

interface OrderTableHeaderProps {
  onSort: (column: keyof Order) => void;
}

type ColumnConfig = {
  key: keyof Order | 'actions';
  label: string;
  width?: string;
  sortable?: boolean;
};

export function OrderTableHeader({ onSort }: OrderTableHeaderProps) {
  const columns: ColumnConfig[] = [
    { key: "id", label: "Order ID", width: "w-[120px]", sortable: true },
    { key: "customer_name", label: "Customer", sortable: true },
    { key: "total_amount", label: "Total Amount", width: "w-[120px]", sortable: true },
    { key: "payment_status", label: "Payment Status", width: "w-[130px]", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "employee_name", label: "Employee", sortable: true },
    { key: "created_at", label: "Created At", width: "w-[150px]", sortable: true },
    { key: "actions", label: "Actions", width: "w-[120px]", sortable: false },
  ];

  const renderSortableHeader = (column: ColumnConfig) => {
    if (!column.sortable) {
      return column.label;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center">
          {column.label}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onSort(column.key as keyof Order)}>
            Sort {column.label}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <TableHeader>
      <TableRow>
        {columns.map((column) => (
          <TableHead
            key={column.key}
            className={`${column.width || ""} ${column.sortable ? 'cursor-pointer' : ''}`}
          >
            {renderSortableHeader(column)}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
