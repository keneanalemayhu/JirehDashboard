"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

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

interface OrderTableRowProps {
  order: Order;
  onClick: (order: Order) => void;
}

export function OrderTableRow({ order, onClick }: OrderTableRowProps) {
  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const getPaymentStatusStyle = (status: Order["payment_status"]) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <TableRow
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => onClick(order)}
    >
      <TableCell>{order.order_id}</TableCell>
      <TableCell>{order.item_name}</TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>{formatCurrency(order.unit_price)}</TableCell>
      <TableCell>{formatCurrency(order.subtotal)}</TableCell>
      <TableCell>{order.employee_name}</TableCell>
      <TableCell>{order.user_name}</TableCell>
      <TableCell>{formatCurrency(order.total_amount)}</TableCell>
      <TableCell>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            getPaymentStatusStyle(order.payment_status)
          )}
        >
          {order.payment_status}
        </span>
      </TableCell>
    </TableRow>
  );
}
