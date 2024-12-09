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
import { Item, locations } from "@/types/dashboard/owner/item";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: Omit<Item, "id">) => void;
}

export function ItemForm({ initialData, onSubmit }: ItemFormProps) {
  const [formData, setFormData] = useState<Omit<Item, "id">>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    location: initialData?.location || "",
    isHidden: initialData?.isHidden || false,
  });

  // Add error states
  const [errors, setErrors] = useState({
    name: false,
    location: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        location: initialData.location,
        isHidden: initialData.isHidden,
      });
      // Clear errors when initialData changes
      setErrors({ name: false, location: false });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: !formData.name.trim(),
      location: !formData.location,
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
          <Label htmlFor="isHidden" className="text-right">
            Hidden
          </Label>
          <Checkbox
            id="isHidden"
            checked={formData.isHidden}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isHidden: checked as boolean })
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
