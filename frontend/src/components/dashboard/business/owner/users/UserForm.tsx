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
  Role,
  UserFormData,
  UserFormProps,
} from "@/types/dashboard/business/user";

export function UserForm({
  initialData,
  onSubmit,
  locations = [],
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    businessId: initialData?.businessId || 0,
    locationId: initialData?.locationId || 0,
    username: initialData?.username || "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "+251",
    role: initialData?.role || Role.SALES,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState({
    username: false,
    name: false,
    email: false,
    phone: false,
    locationId: false,
    role: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        businessId: initialData.businessId || 0,
        locationId: initialData.locationId || 0,
        username: initialData.username || "",
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone?.startsWith("+251")
          ? initialData.phone
          : "+251" + initialData.phone,
        role: initialData.role || Role.SALES,
        isActive: initialData.isActive ?? true,
      });
      setErrors({
        username: false,
        name: false,
        email: false,
        phone: false,
        locationId: false,
        role: false,
      });
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      username: !formData.username.trim(),
      name: !formData.name.trim(),
      email: !formData.email.trim() || !validateEmail(formData.email),
      phone: !formData.phone.trim() || formData.phone.length < 13,
      locationId: !formData.locationId,
      role: !formData.role,
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
          <Label htmlFor="username" className="text-right">
            Username <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setErrors({ ...errors, username: false });
              }}
              className={errors.username ? "border-red-500" : ""}
              required
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">Username is required</p>
            )}
          </div>
        </div>

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
          <Label htmlFor="email" className="text-right">
            Email <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: false });
              }}
              className={errors.email ? "border-red-500" : ""}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid email address
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone" className="text-right">
            Phone <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => {
                const formattedNumber = formatPhoneNumber(e.target.value);
                setFormData({ ...formData, phone: formattedNumber });
                setErrors({ ...errors, phone: false });
              }}
              className={errors.phone ? "border-red-500" : ""}
              placeholder="+251-xx-xxx-xxxx"
              required
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid Ethiopian phone number
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
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
          <Label htmlFor="role" className="text-right">
            Role <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.role}
              onValueChange={(value: Role) => {
                setFormData({ ...formData, role: value });
                setErrors({ ...errors, role: false });
              }}
              required
            >
              <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Role).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-500 mt-1">Role is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isActive" className="text-right">
            Active
          </Label>
          <div className="col-span-3">
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) => {
                setFormData((prev) => ({
                  ...prev,
                  isActive: checked,
                }));
              }}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add User"}
        </Button>
      </DialogFooter>
    </form>
  );
}
