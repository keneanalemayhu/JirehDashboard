"use client";

import { useState, useEffect } from "react";
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
import { Category } from "@/types/dashboard/admin/category";

interface CategoryFormProps {
  initialData?: Partial<Category>;
  onSubmit: (data: Omit<Category, "id">) => void;
}

export function CategoryForm({ initialData, onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState<Omit<Category, "id">>({
    name: "",
    description: "",
    location: "",
    isHidden: false,
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        location: initialData.location || "",
        isHidden: initialData.isHidden || false,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const locations = ["Location 1", "Location 2", "Location 3"]; // Should come from your constants or API

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="col-span-3"
          />
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
            Location
          </Label>
          <Select
            value={formData.location}
            onValueChange={(value) =>
              setFormData({ ...formData, location: value })
            }
          >
            <SelectTrigger className="col-span-3">
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
          {initialData ? "Save changes" : "Add Category"}
        </Button>
      </DialogFooter>
    </form>
  );
}
