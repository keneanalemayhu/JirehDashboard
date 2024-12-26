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
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Expense,
  ExpenseFormData,
  PAYMENT_METHODS,
  RECURRING_FREQUENCIES,
} from "@/types/dashboard/business/retail/owner/expense";

interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  onSubmit: (data: ExpenseFormData) => void;
  locations: Array<{ id: number; name: string }>;
}

export function ExpenseForm({
  initialData,
  onSubmit,
  locations,
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    businessId: initialData?.businessId ?? 0,
    locationId: initialData?.locationId ?? 0,
    name: initialData?.name ?? "",
    amount: initialData?.amount ?? 0,
    description: initialData?.description ?? "",
    expenseDate: initialData?.expenseDate ?? new Date(),
    paymentMethod: initialData?.paymentMethod ?? "Cash",
    receiptNumber: initialData?.receiptNumber ?? "",
    receiptImageUrl: initialData?.receiptImageUrl ?? "",
    isRecurring: initialData?.isRecurring ?? false,
    recurringFrequency: initialData?.recurringFrequency ?? "monthly",
    recurringEndDate: initialData?.recurringEndDate,
    createdBy: initialData?.createdBy ?? 0,
    approvalStatus: "pending",
  });

  const [errors, setErrors] = useState({
    name: false,
    amount: false,
    locationId: false,
    description: false,
    expenseDate: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        expenseDate: new Date(initialData.expenseDate),
        recurringEndDate: initialData.recurringEndDate
          ? new Date(initialData.recurringEndDate)
          : undefined,
      });
      setErrors({
        name: false,
        amount: false,
        locationId: false,
        description: false,
        expenseDate: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      amount: !formData.amount || formData.amount <= 0,
      locationId: !formData.locationId,
      description: !formData.description.trim(),
      expenseDate: !formData.expenseDate,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onSubmit(formData);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);
    setFormData({
      ...formData,
      amount: isNaN(numValue) ? 0 : numValue,
    });
    setErrors({ ...errors, amount: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Select */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="locationId" className="text-right">
          Location <span className="text-red-500">*</span>
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.locationId?.toString()}
            onValueChange={(value) => {
              setFormData({ ...formData, locationId: parseInt(value, 10) });
              setErrors({ ...errors, locationId: false });
            }}
          >
            <SelectTrigger
              className={errors.locationId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent>
              {locations?.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.locationId && (
            <p className="text-sm text-red-500 mt-1">Location is required</p>
          )}
        </div>
      </div>

      {/* Name Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name <span className="text-red-500">*</span>
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

      {/* Amount Input */}
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
            onChange={handleAmountChange}
            className={errors.amount ? "border-red-500" : ""}
            required
          />
          {errors.amount && (
            <p className="text-sm text-red-500 mt-1">
              Valid amount is required
            </p>
          )}
        </div>
      </div>

      {/* Description Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description <span className="text-red-500">*</span>
        </Label>
        <div className="col-span-3">
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setErrors({ ...errors, description: false });
            }}
            className={errors.description ? "border-red-500" : ""}
            required
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">Description is required</p>
          )}
        </div>
      </div>

      {/* Expense Date Picker */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="expenseDate" className="text-right">
          Date <span className="text-red-500">*</span>
        </Label>
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.expenseDate && "text-muted-foreground",
                  errors.expenseDate && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.expenseDate ? (
                  format(formData.expenseDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.expenseDate}
                onSelect={(date) => {
                  setFormData({ ...formData, expenseDate: date ?? new Date() });
                  setErrors({ ...errors, expenseDate: false });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.expenseDate && (
            <p className="text-sm text-red-500 mt-1">Date is required</p>
          )}
        </div>
      </div>

      {/* Payment Method Select */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="paymentMethod" className="text-right">
          Payment Method
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentMethod: value as any })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Receipt Number Input */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="receiptNumber" className="text-right">
          Receipt Number
        </Label>
        <div className="col-span-3">
          <Input
            id="receiptNumber"
            value={formData.receiptNumber}
            onChange={(e) =>
              setFormData({ ...formData, receiptNumber: e.target.value })
            }
          />
        </div>
      </div>

      {/* Recurring Expense Toggle */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="isRecurring" className="text-right">
          Recurring Expense
        </Label>
        <div className="flex items-center space-x-2">
          <Switch
            id="isRecurring"
            checked={formData.isRecurring}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isRecurring: checked })
            }
          />
          <span className="text-sm text-muted-foreground">
            Enable recurring expense settings
          </span>
        </div>
      </div>

      {/* Recurring Frequency Select - Only shown if isRecurring is true */}
      {formData.isRecurring && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="recurringFrequency" className="text-right">
            Frequency
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.recurringFrequency}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  recurringFrequency: value as any,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {RECURRING_FREQUENCIES.map((frequency) => (
                  <SelectItem key={frequency} value={frequency}>
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Recurring End Date Picker - Only shown if isRecurring is true */}
      {formData.isRecurring && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="recurringEndDate" className="text-right">
            End Date
          </Label>
          <div className="col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.recurringEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.recurringEndDate ? (
                    format(formData.recurringEndDate, "PPP")
                  ) : (
                    <span>Set end date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.recurringEndDate}
                  onSelect={(date) =>
                    setFormData({
                      ...formData,
                      recurringEndDate: date ?? undefined,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add Expense"}
        </Button>
      </DialogFooter>
    </form>
  );
}
