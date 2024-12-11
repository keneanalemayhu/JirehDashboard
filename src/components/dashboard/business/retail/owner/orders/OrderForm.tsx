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

interface OrderDetails {
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

interface OrderFormProps {
  initialData: OrderDetails;
  onSubmit: (data: OrderDetails) => void;
}

export function OrderForm({ initialData, onSubmit }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderDetails>(initialData);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setError(false);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.payment_status) {
      setError(true);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        {/* Read-only Fields */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Order ID</Label>
          <div className="col-span-3">
            <p>{formData.order_id}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Item</Label>
          <div className="col-span-3">
            <p>{formData.item_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Quantity</Label>
          <div className="col-span-3">
            <p>{formData.quantity}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Unit Price</Label>
          <div className="col-span-3">
            <p>ETB {formData.unit_price.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Subtotal</Label>
          <div className="col-span-3">
            <p>ETB {formData.subtotal.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Employee</Label>
          <div className="col-span-3">
            <p>{formData.employee_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Seller</Label>
          <div className="col-span-3">
            <p>{formData.user_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Total Amount</Label>
          <div className="col-span-3">
            <p>ETB {formData.total_amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Editable Payment Status */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="payment_status" className="text-right">
            Payment Status <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.payment_status}
              onValueChange={(value: OrderDetails["payment_status"]) => {
                setFormData({ ...formData, payment_status: value });
                setError(false);
              }}
            >
              <SelectTrigger className={error ? "border-red-500" : ""}>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500 mt-1">
                Payment status is required
              </p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">Update Status</Button>
      </DialogFooter>
    </form>
  );
}
