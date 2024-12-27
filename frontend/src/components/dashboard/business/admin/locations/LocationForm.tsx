"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Location } from "@/types/dashboard/business/location";

interface LocationFormProps {
  initialData?: Location;
  onSubmit: (data: Omit<Location, "id">) => void;
}

export function LocationForm({ initialData, onSubmit }: LocationFormProps) {
  const [formData, setFormData] = useState<Omit<Location, "id">>({
    name: initialData?.name || "",
    address: initialData?.address || "",
    phoneNumber: initialData?.phoneNumber || "+251",
    isHidden: initialData?.isHidden || false,
  });

  const [errors, setErrors] = useState({
    name: false,
    address: false,
    phoneNumber: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        address: initialData.address,
        phoneNumber: initialData.phoneNumber.startsWith("+251")
          ? initialData.phoneNumber
          : "+251" + initialData.phoneNumber,
        isHidden: initialData.isHidden || false,
      });
      setErrors({ name: false, address: false, phoneNumber: false });
    }
  }, [initialData]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except '+'
    let numbers = value.replace(/[^\d+]/g, "");

    // Ensure it starts with +251
    if (!numbers.startsWith("+251")) {
      numbers = "+251";
    }

    // Remove any digits beyond the maximum length (+251 + 9 digits)
    if (numbers.length > 13) {
      numbers = numbers.slice(0, 13);
    }

    // Add hyphens after specific positions (if enough digits)
    const parts = [];
    const digitsAfterPrefix = numbers.slice(4); // Get digits after +251

    if (digitsAfterPrefix.length > 0) {
      parts.push(digitsAfterPrefix.slice(0, 2)); // First 2 digits
      if (digitsAfterPrefix.length > 2) {
        parts.push(digitsAfterPrefix.slice(2, 5)); // Next 3 digits
        if (digitsAfterPrefix.length > 5) {
          parts.push(digitsAfterPrefix.slice(5)); // Remaining digits
        }
      }
    }

    return "+251" + (parts.length > 0 ? "-" + parts.join("-") : "");
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formattedNumber });
    setErrors({ ...errors, phoneNumber: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      name: !formData.name.trim(),
      address: !formData.address.trim(),
      phoneNumber:
        !formData.phoneNumber.trim() || formData.phoneNumber.length < 13,
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
          <Label htmlFor="phoneNumber" className="text-right">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneNumberChange}
              className={errors.phoneNumber ? "border-red-500" : ""}
              placeholder="+251-xx-xxx-xxxx"
              required
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid Ethiopian phone number
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isHidden" className="text-right">
            Hidden
          </Label>
          <div className="col-span-3 flex items-center">
            <Checkbox
              id="isHidden"
              checked={formData.isHidden}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isHidden: checked as boolean })
              }
            />
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
