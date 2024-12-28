"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Item } from "@/types/dashboard/business/warehouse/item";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: Omit<Item, "id">) => void;
}

export function ItemForm({ initialData, onSubmit }: ItemFormProps) {
  const [formData, setFormData] = useState<Omit<Item, "id">>({
    name: initialData?.name ?? "",
    price: initialData?.price ?? "",
    category: initialData?.category ?? "",
    barcode: initialData?.barcode ?? "",
    quantity: initialData?.quantity ?? 0,
    isHidden: initialData?.isHidden ?? false,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState({
    quantity: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        price: initialData.price ?? "",
        category: initialData.category ?? "",
        barcode: initialData.barcode ?? "",
        quantity: initialData.quantity ?? 0,
        isHidden: initialData.isHidden ?? false,
        isActive: initialData.isActive ?? true,
      });
      setErrors({
        quantity: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      quantity: typeof formData.quantity !== "number" || formData.quantity < 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onSubmit({
      ...initialData!,
      quantity: formData.quantity,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    setFormData({
      ...formData,
      quantity: isNaN(numValue) ? 0 : numValue,
    });
    setErrors({ quantity: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        {/* Name (Read-only) */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <div className="col-span-3">
            <Input
              id="name"
              value={formData.name}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Barcode (Read-only) */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="barcode" className="text-right">
            Barcode
          </Label>
          <div className="col-span-3">
            <Input
              id="barcode"
              value={formData.barcode}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Price (Read-only) */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price
          </Label>
          <div className="col-span-3">
            <Input
              id="price"
              value={formData.price}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Quantity (Editable) */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="quantity" className="text-right">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleQuantityChange}
              className={errors.quantity ? "border-red-500" : ""}
              required
            />
            {errors.quantity && (
              <p className="text-sm text-red-500 mt-1">
                Quantity must be 0 or greater
              </p>
            )}
          </div>
        </div>

        {/* Category (Read-only) */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category
          </Label>
          <div className="col-span-3">
            <Input
              id="category"
              value={formData.category}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Status</Label>
          <div className="col-span-3">
            <Input
              value={`${formData.isActive ? "Active" : "Inactive"} ${
                formData.isHidden ? "(Hidden)" : "(Visible)"
              }`}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">Update Quantity</Button>
      </DialogFooter>
    </form>
  );
}
