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
  Employee,
  EmployeeStatus,
  locations,
} from "@/types/dashboard/business/retail/owner/employee";

export function EmployeeForm({ initialData, onSubmit }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    name: initialData?.name || "",
    phone: initialData?.phone || "+251",
    salary: initialData?.salary || 0,
    status: initialData?.status || EmployeeStatus.FULL_TIME,
    location: initialData?.location || "",
    isActive: initialData?.isActive || true,
  });

  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    salary: false,
    status: false,
    location: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone.startsWith("+251")
          ? initialData.phone
          : "+251" + initialData.phone,
        salary: initialData.salary,
        status: initialData.status,
        location: initialData.location,
        isActive: initialData.isActive,
      });
      setErrors({
        name: false,
        phone: false,
        salary: false,
        status: false,
        location: false,
      });
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
    setFormData({ ...formData, phone: formattedNumber });
    setErrors({ ...errors, phone: false });
  };

  const formatSalary = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/[^\d]/g, "");
    // Convert to number and format with ETB
    const amount = Number(numbers);
    return amount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      phone: !formData.phone.trim() || formData.phone.length < 13,
      salary: formData.salary <= 0,
      status: !formData.status,
      location: !formData.location,
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
          <Label htmlFor="phone" className="text-right">
            Phone <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="phone"
              value={formData.phone}
              onChange={handlePhoneNumberChange}
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
          <Label htmlFor="salary" className="text-right">
            Salary (ETB) <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ETB
              </span>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => {
                  const value = formatSalary(e.target.value);
                  setFormData({ ...formData, salary: value });
                  setErrors({ ...errors, salary: false });
                }}
                className={`pl-12 ${errors.salary ? "border-red-500" : ""}`}
                required
                min="0"
              />
            </div>
            {errors.salary && (
              <p className="text-sm text-red-500 mt-1">
                Valid salary is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.status}
              onValueChange={(value: EmployeeStatus) => {
                setFormData({ ...formData, status: value });
                setErrors({ ...errors, status: false });
              }}
              required
            >
              <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                <SelectValue placeholder="Select employee status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EmployeeStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">Status is required</p>
            )}
          </div>
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
          <Label htmlFor="isActive" className="text-right">
            Active
          </Label>
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked as boolean })
            }
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit">
          {initialData ? "Save changes" : "Add Employee"}
        </Button>
      </DialogFooter>
    </form>
  );
}
