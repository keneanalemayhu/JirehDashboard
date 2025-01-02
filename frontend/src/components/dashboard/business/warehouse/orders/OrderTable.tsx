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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrderForm } from "./OrderForm";
import { OrderTableHeader } from "./OrderTableHeader";
import { Order, OrderStatus, OrderStatuses } from "@/types/dashboard/business/order";

interface OrderTableProps {
  orders: Order[];
  onSort: (column: keyof Order) => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  selectedOrder?: Order | null;
}

export function OrderTable({
  orders,
  onSort,
  onStatusUpdate,
  selectedOrder: propSelectedOrder,
}: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(propSelectedOrder || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const getOrderStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatuses.COMPLETED:
        return "bg-green-100 text-green-800";
      case OrderStatuses.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatuses.CANCELLED:
        return "bg-red-100 text-red-800";
      case OrderStatuses.PROCESSING:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = (order: Order) => {
    onStatusUpdate(order.id, OrderStatuses.COMPLETED);
    setIsDialogOpen(false);
  };

  const handleMarkAsComplete = (order: Order) => {
    setConfirmOrder(order);
    setShowConfirmDialog(true);
  };

  const handleConfirmStatusUpdate = () => {
    if (confirmOrder) {
      onStatusUpdate(confirmOrder.id, OrderStatuses.COMPLETED);
    }
    setShowConfirmDialog(false);
    setConfirmOrder(null);
  };

  return (
    <div className="space-y-4">
      <Table>
        <OrderTableHeader onSort={onSort} />
        <TableBody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b transition-colors"
              onClick={() => {
                setSelectedOrder(order);
                setIsDialogOpen(true);
              }}
            >
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.customer_name || 'N/A'}</td>
              <td className="px-4 py-2">{formatCurrency(order.total_amount)}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getOrderStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-2">{order.status}</td>
              <td className="px-4 py-2">{order.employee_name || 'N/A'}</td>
              <td className="px-4 py-2">
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {order.status === OrderStatuses.PENDING && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsComplete(order);
                    }}
                  >
                    Mark as Complete
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View and manage order details
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderForm
              order={selectedOrder}
              onStatusUpdate={handleStatusUpdate}
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this order as complete? This action cannot be easily reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStatusUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
