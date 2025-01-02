"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Order, PaymentStatus, PaymentStatuses } from "@/types/dashboard/business/order";

interface OrderFormProps {
  order: Order;
  onStatusUpdate: (order: Order) => void;
  onClose: () => void;
}

export function OrderForm({ order, onStatusUpdate, onClose }: OrderFormProps) {
  const [formData, setFormData] = useState<Order>(order);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData(order);
      setError(false);
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.payment_status) {
      setError(true);
      return;
    }

    onStatusUpdate(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Order ID</Label>
          <div className="mt-1 text-sm">{formData.id}</div>
        </div>
        <div>
          <Label>Customer</Label>
          <div className="mt-1 text-sm">{formData.customer_name || 'N/A'}</div>
        </div>
        <div>
          <Label>Total Amount</Label>
          <div className="mt-1 text-sm">ETB {formData.total_amount.toLocaleString()}</div>
        </div>
        <div>
          <Label>Employee</Label>
          <div className="mt-1 text-sm">{formData.employee_name || 'N/A'}</div>
        </div>
        <div className="col-span-2">
          <Label>Payment Status</Label>
          <Select
            value={formData.payment_status}
            onValueChange={(value: PaymentStatus) =>
              setFormData({ ...formData, payment_status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PaymentStatuses.PENDING}>Pending</SelectItem>
              <SelectItem value={PaymentStatuses.PAID}>Paid</SelectItem>
              <SelectItem value={PaymentStatuses.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
          {error && (
            <p className="mt-1 text-sm text-red-600">
              Please select a payment status
            </p>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Update Order</Button>
      </DialogFooter>
    </form>
  );
}
