"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";
import { Item, ItemFormData } from "@/types/dashboard/business/item";
import { useCategories } from "@/hooks/dashboard/business/category";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { itemApi } from "@/lib/api/item";
import debounce from 'lodash/debounce';

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: ItemFormData) => Promise<void>;
  locationId: number;
  categoryId: number;
}

export function ItemForm({ initialData, onSubmit, locationId, categoryId }: ItemFormProps) {
  const { categories } = useCategories(locationId);
  const [formData, setFormData] = useState<ItemFormData>({
    name: initialData?.name ?? "",
    price: initialData?.price ?? "",
    categoryId: initialData?.categoryId ?? 0,
    barcode: initialData?.barcode ?? "",
    quantity: initialData?.quantity ?? 0,
    isHidden: initialData?.isHidden ?? false,
    isActive: initialData?.isActive ?? true,
    isTemporary: initialData?.isTemporary ?? false,
    expiryHours: initialData?.expiryHours ?? null,
    autoResetQuantity: initialData?.autoResetQuantity ?? false,
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    quantity: false,
    expiryHours: false,
    categoryId: false,
    barcode: false,
    api: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        categoryId: initialData.categoryId,
        barcode: initialData.barcode,
        quantity: initialData.quantity,
        isHidden: initialData.isHidden,
        isActive: initialData.isActive,
        isTemporary: initialData.isTemporary,
        expiryHours: initialData.expiryHours,
        autoResetQuantity: initialData.autoResetQuantity,
      });
      setErrors({
        name: false,
        price: false,
        quantity: false,
        expiryHours: false,
        categoryId: false,
        barcode: false,
        api: "",
      });
    }
  }, [initialData]);

  // Debounced barcode check
  const checkBarcode = debounce(async (barcode: string) => {
    if (!barcode || barcode === initialData?.barcode) {
      setErrors(prev => ({ ...prev, barcode: false }));
      return;
    }

    const isAvailable = await itemApi.checkBarcode(categoryId, barcode);
    if (!isAvailable) {
      setErrors(prev => ({ ...prev, barcode: "This barcode is already in use" }));
      toast.error("This barcode is already in use");
    } else {
      setErrors(prev => ({ ...prev, barcode: false }));
    }
  }, 500);

  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBarcode = e.target.value;
    setFormData(prev => ({ ...prev, barcode: newBarcode }));
    checkBarcode(newBarcode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      price: !formData.price || parseFloat(formData.price) <= 0,
      quantity: typeof formData.quantity !== "number" || formData.quantity < 0,
      expiryHours:
        formData.isTemporary &&
        (!formData.expiryHours || formData.expiryHours <= 0),
      categoryId: !formData.categoryId,
    };

    const hasErrors = Object.entries(newErrors).some(([key, value]) => {
      if (value) {
        let errorMessage = "";
        switch (key) {
          case "name":
            errorMessage = "Name is required";
            break;
          case "price":
            errorMessage = "Price must be greater than 0";
            break;
          case "quantity":
            errorMessage = "Quantity must be 0 or greater";
            break;
          case "expiryHours":
            errorMessage = "Expiry hours must be greater than 0";
            break;
          case "categoryId":
            errorMessage = "Category is required";
            break;
        }
        toast.error(errorMessage);
        return true;
      }
      return false;
    });

    setErrors(prev => ({ ...prev, ...newErrors, api: "" }));

    if (hasErrors) {
      return;
    }

    // Check barcode one last time before submitting
    if (formData.barcode && formData.barcode !== initialData?.barcode) {
      const isAvailable = await itemApi.checkBarcode(categoryId, formData.barcode);
      if (!isAvailable) {
        setErrors(prev => ({ ...prev, barcode: "This barcode is already in use" }));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors || {};
      setErrors(prev => ({
        ...prev,
        api: err.response?.data?.message || err.message,
      }));
      
      toast.error(err.response?.data?.message || "Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500">Name is required</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId?.toString() || ""}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categoryId: parseInt(value) }))
            }
          >
            <SelectTrigger className={errors.categoryId ? "border-red-500" : ""}>
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
            <p className="text-sm text-red-500">Category is required</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={handleBarcodeChange}
            className={errors.barcode ? "border-red-500" : ""}
          />
          {errors.barcode && (
            <p className="text-sm text-red-500">{errors.barcode}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-sm text-red-500">
              Price must be greater than 0
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                quantity: parseInt(e.target.value) || 0,
              }))
            }
            className={errors.quantity ? "border-red-500" : ""}
          />
          {errors.quantity && (
            <p className="text-sm text-red-500">
              Quantity must be 0 or greater
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isActive: checked }))
            }
          />
          <Label htmlFor="isActive">Active</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isHidden"
            checked={formData.isHidden}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isHidden: checked }))
            }
          />
          <Label htmlFor="isHidden">Hidden</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="isTemporary"
            checked={formData.isTemporary}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                isTemporary: checked,
                expiryHours: checked ? prev.expiryHours || 24 : null,
                autoResetQuantity: checked ? prev.autoResetQuantity : false,
              }))
            }
          />
          <Label htmlFor="isTemporary">Temporary Item</Label>
        </div>

        {formData.isTemporary && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="expiryHours">Expiry Hours</Label>
              <Input
                id="expiryHours"
                type="number"
                value={formData.expiryHours || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expiryHours: parseInt(e.target.value) || null,
                  }))
                }
                className={errors.expiryHours ? "border-red-500" : ""}
              />
              {errors.expiryHours && (
                <p className="text-sm text-red-500">
                  Expiry hours must be greater than 0
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="autoResetQuantity"
                checked={formData.autoResetQuantity}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    autoResetQuantity: checked,
                  }))
                }
              />
              <Label htmlFor="autoResetQuantity">Auto Reset Quantity</Label>
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting || !!errors.barcode}>
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"} Item
        </Button>
      </DialogFooter>
    </form>
  );
}
