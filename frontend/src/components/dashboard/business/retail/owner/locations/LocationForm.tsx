"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Location,
  LocationFormData,
} from "@/types/dashboard/business/retail/owner/location";

interface LocationFormProps {
  initialData?: Partial<Location>;
  onSubmit: (data: LocationFormData) => void;
}

export function LocationForm({ initialData, onSubmit }: LocationFormProps) {
  const [formData, setFormData] = useState<LocationFormData>({
    name: initialData?.name || "",
    address: initialData?.address || "",
    contactNumber: initialData?.contactNumber || "+251",
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState({
    name: false,
    address: false,
    contactNumber: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        contactNumber: initialData.contactNumber?.startsWith("+251")
          ? initialData.contactNumber
          : "+251" + initialData.contactNumber,
        isActive: initialData.isActive ?? true,
      });
      setErrors({ name: false, address: false, contactNumber: false });
    }
  }, [initialData]);

  const formatPhoneNumber = (value: string) => {
    let numbers = value.replace(/[^\d+]/g, "");

    if (!numbers.startsWith("+251")) {
      numbers = "+251";
    }

    if (numbers.length > 13) {
      numbers = numbers.slice(0, 13);
    }

    const parts = [];
    const digitsAfterPrefix = numbers.slice(4);

    if (digitsAfterPrefix.length > 0) {
      parts.push(digitsAfterPrefix.slice(0, 2));
      if (digitsAfterPrefix.length > 2) {
        parts.push(digitsAfterPrefix.slice(2, 5));
        if (digitsAfterPrefix.length > 5) {
          parts.push(digitsAfterPrefix.slice(5));
        }
      }
    }

    return "+251" + (parts.length > 0 ? "-" + parts.join("-") : "");
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, contactNumber: formattedNumber });
    setErrors({ ...errors, contactNumber: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      address: !formData.address.trim(),
      contactNumber:
        !formData.contactNumber.trim() || formData.contactNumber.length < 13,
    };

    setErrors(newErrors);

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
          <Label htmlFor="address" className="text-right">
            Address <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                setErrors({ ...errors, address: false });
              }}
              className={errors.address ? "border-red-500" : ""}
              required
            />
            {errors.address && (
              <p className="text-sm text-red-500 mt-1">Address is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="contactNumber" className="text-right">
            Contact Number <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handlePhoneNumberChange}
              className={errors.contactNumber ? "border-red-500" : ""}
              placeholder="+251-xx-xxx-xxxx"
              required
            />
            {errors.contactNumber && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid Ethiopian phone number
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isActive" className="text-right">
            Active
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive" className="text-sm text-muted-foreground">
              Location is active and visible
            </Label>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add Location"}
        </Button>
      </DialogFooter>
    </form>
  );
}
