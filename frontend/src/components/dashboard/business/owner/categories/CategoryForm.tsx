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
import {
  Category,
  CategoryFormData,
} from "@/types/dashboard/business/category";

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => void;
  locations: Array<{ id: number; name: string }>;
  businessId: number;
  userId: number;
}

export function CategoryForm({
  initialData,
  onSubmit,
  locations,
  businessId,
  userId,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    businessId: initialData?.businessId || businessId,
    locationId: initialData?.locationId || locations[0]?.id || 0, // Default to first location
    name: initialData?.name || "",
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
    isHidden: initialData?.isHidden ?? false,
    createdBy: initialData?.createdBy || userId,
  });
  
  // Add error states
  const [errors, setErrors] = useState({
    name: false,
    locationId: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        businessId: initialData.businessId || businessId,
        locationId: initialData.locationId || 0,
        name: initialData.name || "",
        description: initialData.description || "",
        isActive: initialData.isActive ?? true,
        isHidden: initialData.isHidden ?? false,
        createdBy: initialData.createdBy || userId,
      });
      // Clear errors when initialData changes
      setErrors({ name: false, locationId: false });
    }
  }, [initialData, businessId, userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: !formData.name.trim(),
      locationId: !formData.locationId,
    };

    setErrors(newErrors);

    // If there are any errors, don't submit
    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
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

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="locationId" className="text-right">
            Location <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.locationId.toString()}
              onValueChange={(value) => {
                setFormData({ ...formData, locationId: parseInt(value) });
                setErrors({ ...errors, locationId: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.locationId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
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

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Status</Label>
          <div className="col-span-3 flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked as boolean })
                }
              />
              <Label htmlFor="isActive" className="text-sm font-normal">
                Active
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isHidden"
                checked={formData.isHidden}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isHidden: checked as boolean })
                }
              />
              <Label htmlFor="isHidden" className="text-sm font-normal">
                Hidden
              </Label>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add Category"}
        </Button>
      </DialogFooter>
    </form>
  );
}
