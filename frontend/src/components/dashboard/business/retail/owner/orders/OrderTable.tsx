"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Order,
  PaymentStatus,
} from "@/types/dashboard/business/retail/owner/order";
import { Badge } from "@/components/ui/badge";

interface OrderTableProps {
  orders: Order[];
  settings: {
    showAmounts: boolean;
    showEmployeeInfo: boolean;
    showCustomerInfo: boolean;
    sortDirection: "asc" | "desc";
    itemsPerPage: number;
    statusFilter: PaymentStatus[];
  };
  onSort?: (column: keyof Order) => void;
  onStatusUpdate?: (orderId: string, status: PaymentStatus) => void;
  selectedOrder?: Order | null;
}

export function OrderTable({
  orders,
  settings,
  onSort,
  onStatusUpdate,
  selectedOrder,
}: OrderTableProps) {
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "ETB 0";
    return `ETB ${amount.toLocaleString()}`;
  };

  const getPaymentStatusStyle = (status: PaymentStatus | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status) {
      case PaymentStatus.PAID:
        return "bg-green-100 text-green-800";
      case PaymentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case PaymentStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Order Number</TableHead>
            {settings.showCustomerInfo && (
              <>
                <TableHead>Customer Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </>
            )}
            {settings.showEmployeeInfo && <TableHead>Employee</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            {settings.showAmounts && (
              <TableHead className="text-right">Amount</TableHead>
            )}
            <TableHead className="text-right">Order Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.order_id}>
              <TableCell className="font-medium">{order.order_id}</TableCell>
              <TableCell>{order.order_number}</TableCell>
              {settings.showCustomerInfo && (
                <>
                  <TableCell>{order.customer?.name || "N/A"}</TableCell>
                  <TableCell>{order.customer?.phone || "N/A"}</TableCell>
                  <TableCell>{order.customer?.email || "N/A"}</TableCell>
                </>
              )}
              {settings.showEmployeeInfo && (
                <TableCell>{order.employee_name || "N/A"}</TableCell>
              )}
              <TableCell>
                <Badge variant="outline">{order.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPaymentStatusStyle(order.payment_status)}>
                  {order.payment_status}
                </Badge>
              </TableCell>
              {settings.showAmounts && (
                <TableCell className="text-right">
                  {formatCurrency(order.total_amount)}
                </TableCell>
              )}
              <TableCell className="text-right">
                {formatDate(order.order_date)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onStatusUpdate &&
                    order.payment_status !== PaymentStatus.PAID && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onStatusUpdate(order.order_id, PaymentStatus.PAID)
                        }
                      >
                        Mark as Paid
                      </Button>
                    )}
                  {onStatusUpdate &&
                    order.payment_status === PaymentStatus.PENDING && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onStatusUpdate(
                            order.order_id,
                            PaymentStatus.CANCELLED
                          )
                        }
                        className="text-red-500"
                      >
                        Cancel
                      </Button>
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={
                  4 +
                  (settings.showCustomerInfo ? 3 : 0) +
                  (settings.showEmployeeInfo ? 1 : 0) +
                  (settings.showAmounts ? 1 : 0)
                }
                className="h-24 text-center"
              >
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
