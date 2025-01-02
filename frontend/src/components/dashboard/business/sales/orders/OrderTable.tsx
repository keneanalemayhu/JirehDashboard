"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Order } from "@/types/dashboard/business/order";
import { formatCurrency } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface OrderTableProps {
  orders: Order[];
  showAmounts: boolean;
  showEmployeeInfo: boolean;
  showCustomerInfo: boolean;
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  isLoading: boolean;
}

export function OrderTable({
  orders,
  showAmounts,
  showEmployeeInfo,
  showCustomerInfo,
  onSort,
  sortColumn,
  sortDirection,
  isLoading,
}: OrderTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort('id')}
            >
              Order ID
              {sortColumn === 'id' && (
                <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            {showCustomerInfo && (
              <>
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Customer Email</TableHead>
              </>
            )}
            {showEmployeeInfo && (
              <TableHead>Employee</TableHead>
            )}
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort('status')}
            >
              Status
              {sortColumn === 'status' && (
                <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort('payment_status')}
            >
              Payment
              {sortColumn === 'payment_status' && (
                <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            {showAmounts && (
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => onSort('total_amount')}
              >
                Amount
                {sortColumn === 'total_amount' && (
                  <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
            )}
            <TableHead
              className="cursor-pointer"
              onClick={() => onSort('created_at')}
            >
              Date
              {sortColumn === 'created_at' && (
                <span className="ml-2">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              {showCustomerInfo && (
                <>
                  <TableCell>{order.customer_name || 'N/A'}</TableCell>
                  <TableCell>{order.customer_phone || 'N/A'}</TableCell>
                  <TableCell>{order.customer_email || 'N/A'}</TableCell>
                </>
              )}
              {showEmployeeInfo && (
                <TableCell>Employee Name</TableCell>
              )}
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  order.payment_status === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : order.payment_status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </TableCell>
              {showAmounts && (
                <TableCell className="text-right">{formatCurrency(order.total_amount)}</TableCell>
              )}
              <TableCell>{new Date(order.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
