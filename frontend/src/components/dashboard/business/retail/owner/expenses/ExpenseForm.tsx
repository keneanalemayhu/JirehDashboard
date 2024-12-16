"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Expense,
  locations,
} from "@/types/dashboard/business/retail/owner/expense";

// Define frequency options
const frequencies = [
  "One-time",
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
] as const;
type Frequency = (typeof frequencies)[number];

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (data: Omit<Expense, "id">) => void;
}

export function ExpenseForm({ initialData, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Omit<Expense, "id">>({
    name: initialData?.name || "",
    amount: initialData?.amount || 0,
    location: initialData?.location || "",
    expenseDate:
      initialData?.expenseDate || new Date().toISOString().split("T")[0],
    frequency: initialData?.frequency || "One-time",
  });

  // Add error states
  const [errors, setErrors] = useState({
    name: false,
    amount: false,
    location: false,
    expenseDate: false,
    frequency: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        amount: initialData.amount,
        location: initialData.location,
        expenseDate: initialData.expenseDate,
        frequency: initialData.frequency || "One-time",
      });
      // Clear errors when initialData changes
      setErrors({
        name: false,
        amount: false,
        location: false,
        expenseDate: false,
        frequency: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: !formData.name.trim(),
      amount: formData.amount <= 0,
      location: !formData.location,
      expenseDate: !formData.expenseDate,
      frequency: !formData.frequency,
    };

    setErrors(newErrors);

    // If there are any errors, don't submit
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Expense Name <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: false });
              }}
              className={errors.name ? "border-red-500" : ""}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">Name is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  amount: parseFloat(e.target.value),
                });
                setErrors({ ...errors, amount: false });
              }}
              className={errors.amount ? "border-red-500" : ""}
              required
            />
            {errors.amount && (
              <p className="text-sm text-red-500 mt-1">
                Amount must be greater than 0
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.location}
              onValueChange={(value) => {
                setFormData({ ...formData, location: value });
                setErrors({ ...errors, location: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.location ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location && (
              <p className="text-sm text-red-500 mt-1">Location is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="frequency" className="text-right">
            Frequency <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.frequency}
              onValueChange={(value) => {
                setFormData({ ...formData, frequency: value as Frequency });
                setErrors({ ...errors, frequency: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.frequency ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-sm text-red-500 mt-1">Frequency is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="expenseDate" className="text-right">
            Date <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="expenseDate"
              type="date"
              value={formData.expenseDate}
              onChange={(e) => {
                setFormData({ ...formData, expenseDate: e.target.value });
                setErrors({ ...errors, expenseDate: false });
              }}
              className={errors.expenseDate ? "border-red-500" : ""}
              required
            />
            {errors.expenseDate && (
              <p className="text-sm text-red-500 mt-1">Date is required</p>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add Expense"}
        </Button>
      </DialogFooter>
    </form>
  );
}
