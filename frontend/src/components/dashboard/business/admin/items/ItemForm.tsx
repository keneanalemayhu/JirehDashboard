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
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Item } from "@/types/dashboard/business/item";

const DEFAULT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food",
  "Beverages",
  "Home & Garden",
  "Books",
  "Toys",
] as const;

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: Omit<Item, "id">) => void;
  categories?: string[];
}

export function ItemForm({
  initialData,
  onSubmit,
  categories = DEFAULT_CATEGORIES,
}: ItemFormProps) {
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
    name: false,
    price: false,
    category: false,
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
        name: false,
        price: false,
        category: false,
        quantity: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      price: !formData.price || parseFloat(formData.price) <= 0,
      category: !formData.category,
      quantity: typeof formData.quantity !== "number" || formData.quantity < 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onSubmit(formData);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    setFormData({
      ...formData,
      quantity: isNaN(numValue) ? 0 : numValue,
    });
    setErrors({ ...errors, quantity: false });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      price: value === "" ? "0" : value,
    });
    setErrors({ ...errors, price: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
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

        {/* Barcode Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="barcode" className="text-right">
            Barcode
          </Label>
          <div className="col-span-3">
            <Input
              id="barcode"
              value={formData.barcode}
              onChange={(e) => {
                setFormData({ ...formData, barcode: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Price Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Price <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handlePriceChange}
              className={errors.price ? "border-red-500" : ""}
              required
            />
            {errors.price && (
              <p className="text-sm text-red-500 mt-1">
                Valid price is required
              </p>
            )}
          </div>
        </div>

        {/* Quantity Input */}
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

        {/* Category Select */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Category <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.category || undefined}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value });
                setErrors({ ...errors, category: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">Category is required</p>
            )}
          </div>
        </div>

        {/* Active Checkbox */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isActive" className="text-right">
            Active
          </Label>
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: !!checked })
            }
          />
        </div>

        {/* Hidden Checkbox */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isHidden" className="text-right">
            Hidden
          </Label>
          <Checkbox
            id="isHidden"
            checked={formData.isHidden}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isHidden: !!checked })
            }
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add Item"}
        </Button>
      </DialogFooter>
    </form>
  );
}
