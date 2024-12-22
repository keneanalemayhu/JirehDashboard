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
import { Switch } from "@/components/ui/switch";
import {
  Item,
  ItemFormData,
} from "@/types/dashboard/business/retail/owner/item";
import { useCategories } from "@/hooks/dashboard/business/retail/owner/category";

interface ItemFormProps {
  initialData?: Partial<Item>;
  onSubmit: (data: ItemFormData) => void;
  defaultTemporary?: boolean;
}

export function ItemForm({
  initialData,
  onSubmit,
  defaultTemporary = false,
}: ItemFormProps) {
  const { categories } = useCategories();

  const [formData, setFormData] = useState<ItemFormData>({
    name: initialData?.name ?? "",
    price: initialData?.price ?? "",
    categoryId: initialData?.categoryId ?? Number(categories[0]?.id) ?? 0,
    barcode: initialData?.barcode ?? "",
    quantity: initialData?.quantity ?? 0,
    isHidden: initialData?.isHidden ?? false,
    isActive: initialData?.isActive ?? true,
    isTemporary: (defaultTemporary || initialData?.isTemporary) ?? false,
    expiryHours: initialData?.expiryHours ?? null,
    autoResetQuantity: initialData?.autoResetQuantity ?? false,
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    categoryId: false,
    quantity: false,
    expiryHours: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        price: initialData.price ?? "",
        categoryId: initialData.categoryId ?? 0,
        barcode: initialData.barcode ?? "",
        quantity: initialData.quantity ?? 0,
        isHidden: initialData.isHidden ?? false,
        isActive: initialData.isActive ?? true,
        isTemporary: initialData.isTemporary ?? false,
        expiryHours: initialData.expiryHours ?? null,
        autoResetQuantity: initialData.autoResetQuantity ?? false,
      });
      setErrors({
        name: false,
        price: false,
        categoryId: false,
        quantity: false,
        expiryHours: false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      price: !formData.price || parseFloat(formData.price) <= 0,
      categoryId: !formData.categoryId,
      quantity: typeof formData.quantity !== "number" || formData.quantity < 0,
      expiryHours:
        formData.isTemporary &&
        (!formData.expiryHours || formData.expiryHours <= 0),
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

  const handleExpiryHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);
    setFormData({
      ...formData,
      expiryHours: isNaN(numValue) ? null : numValue,
    });
    setErrors({ ...errors, expiryHours: false });
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
          <Label htmlFor="categoryId" className="text-right">
            Category <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.categoryId?.toString()} // Use categoryId
              onValueChange={(value) => {
                setFormData({ ...formData, categoryId: parseInt(value, 10) });
                setErrors({ ...errors, categoryId: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.categoryId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500 mt-1">Category is required</p>
            )}
          </div>
        </div>

        {/* Temporary Item Toggle */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isTemporary" className="text-right">
            Temporary Item
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="isTemporary"
              checked={formData.isTemporary}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  isTemporary: checked,
                  expiryHours: checked ? formData.expiryHours : null,
                  autoResetQuantity: checked
                    ? formData.autoResetQuantity
                    : false,
                });
              }}
            />
            <Label
              htmlFor="isTemporary"
              className="text-sm text-muted-foreground"
            >
              Enable temporary item settings
            </Label>
          </div>
        </div>

        {/* Expiry Hours Input - Only shown if isTemporary is true */}
        {formData.isTemporary && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiryHours" className="text-right">
              Expiry Hours <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="expiryHours"
                type="number"
                min="1"
                value={formData.expiryHours || ""}
                onChange={handleExpiryHoursChange}
                className={errors.expiryHours ? "border-red-500" : ""}
                required={formData.isTemporary}
              />
              {errors.expiryHours && (
                <p className="text-sm text-red-500 mt-1">
                  Valid expiry hours required for temporary items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Auto Reset Quantity Toggle - Only shown if isTemporary is true */}
        {formData.isTemporary && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="autoResetQuantity" className="text-right">
              Auto Reset Quantity
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="autoResetQuantity"
                checked={formData.autoResetQuantity}
                onCheckedChange={(checked) => {
                  setFormData({ ...formData, autoResetQuantity: checked });
                }}
              />
              <Label
                htmlFor="autoResetQuantity"
                className="text-sm text-muted-foreground"
              >
                Automatically reset quantity after expiry
              </Label>
            </div>
          </div>
        )}

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
