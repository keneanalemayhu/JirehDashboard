"use client";

import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OrderForm } from "./OrderForm";
import { OrderTableHeader } from "./OrderTableHeader";

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

interface OrderTableProps {
  orders: Order[];
  onSort: (column: keyof Order) => void;
  onStatusUpdate: (order: Order) => void;
}

export function OrderTable({
  orders,
  onSort,
  onStatusUpdate,
}: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleRowClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = (updatedOrder: Order) => {
    onStatusUpdate(updatedOrder);
    setIsDialogOpen(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <OrderTableHeader onSort={onSort} />
          <TableBody>
            {orders.map((order) => (
              <tr
                key={order.order_id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(order)}
              >
                <td className="px-4 py-3 text-sm">{order.order_id}</td>
                <td className="px-4 py-3 text-sm">{order.item_name}</td>
                <td className="px-4 py-3 text-sm">{order.quantity}</td>
                <td className="px-4 py-3 text-sm">
                  {formatCurrency(order.unit_price)}
                </td>
                <td className="px-4 py-3 text-sm">
                  {formatCurrency(order.subtotal)}
                </td>
                <td className="px-4 py-3 text-sm">{order.employee_name}</td>
                <td className="px-4 py-3 text-sm">{order.user_name}</td>
                <td className="px-4 py-3 text-sm">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusStyle(
                      order.payment_status
                    )}`}
                  >
                    {order.payment_status === "PAID"
                      ? "Completed"
                      : order.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View order details and update payment status.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderForm
              initialData={selectedOrder}
              onSubmit={handleStatusUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
