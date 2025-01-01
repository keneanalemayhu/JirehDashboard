"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Category,
  CategoryFormData,
  DEFAULT_CATEGORY,
} from "@/types/dashboard/business/category";

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => void;
}

export function CategoryForm({
  initialData,
  onSubmit,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    ...DEFAULT_CATEGORY,
    ...initialData,
  });
  
  // Add error states
  const [errors, setErrors] = useState({
    name: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...DEFAULT_CATEGORY,
        ...initialData,
      });
      // Clear errors when initialData changes
      setErrors({ name: false });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: !formData.name.trim(),
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
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <div className="col-span-3">
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Status</Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked as boolean })
              }
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Visibility</Label>
          <div className="col-span-3 flex items-center space-x-2">
            <Checkbox
              id="isHidden"
              checked={formData.isHidden}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isHidden: checked as boolean })
              }
            />
            <Label htmlFor="isHidden">Hidden</Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
}
