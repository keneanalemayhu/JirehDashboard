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
import { EmployeeFormData } from "@/types/dashboard/business/employee";
import { useLocations } from "@/hooks/dashboard/business/location";

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  isLoading?: boolean;
}

export function EmployeeForm({ initialData, onSubmit, isLoading = false }: EmployeeFormProps) {
  const { locations } = useLocations();
  const [formData, setFormData] = useState<EmployeeFormData>({
    fullName: initialData?.fullName || "",
    position: initialData?.position || "",
    phone: initialData?.phone || "+251",
    email: initialData?.email || "",
    hireDate: initialData?.hireDate || new Date().toISOString().split("T")[0],
    salary: initialData?.salary || 0,
    employmentStatus: initialData?.employmentStatus || "full_time",
    locationId: initialData?.locationId || 0,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState({
    fullName: false,
    position: false,
    phone: false,
    email: false,
    hireDate: false,
    salary: false,
    employmentStatus: false,
    locationId: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        position: initialData.position,
        phone: initialData.phone.startsWith("+251")
          ? initialData.phone
          : "+251" + initialData.phone,
        email: initialData.email,
        hireDate: initialData.hireDate,
        salary: initialData.salary,
        employmentStatus: initialData.employmentStatus,
        locationId: initialData.locationId,
        isActive: initialData.isActive,
      });
      setErrors({
        fullName: false,
        position: false,
        phone: false,
        email: false,
        hireDate: false,
        salary: false,
        employmentStatus: false,
        locationId: false,
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

    return numbers; // Return just the clean number without hyphens for the backend
  };

  const formatPhoneNumberForDisplay = (value: string) => {
    const cleanNumber = formatPhoneNumber(value);
    if (cleanNumber.length <= 4) return cleanNumber;

    // Format for display with hyphens
    const digitsAfterPrefix = cleanNumber.slice(4);
    const parts = [];

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
    setFormData({ ...formData, phone: formattedNumber });
    setErrors({ ...errors, phone: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      fullName: !formData.fullName.trim(),
      position: !formData.position.trim(),
      phone: !formData.phone.trim() || formData.phone.length < 13,
      email: !formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      hireDate: !formData.hireDate,
      salary: formData.salary <= 0,
      employmentStatus: !formData.employmentStatus,
      locationId: !formData.locationId,
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
          <Label htmlFor="fullName" className="text-right">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
                setErrors({ ...errors, fullName: false });
              }}
              className={errors.fullName ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">Full name is required</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="position" className="text-right">
            Position <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => {
                setFormData({ ...formData, position: e.target.value });
                setErrors({ ...errors, position: false });
              }}
              className={errors.position ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.position && (
              <p className="text-sm text-red-500 mt-1">Position is required</p>
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
              value={formatPhoneNumberForDisplay(formData.phone)}
              onChange={handlePhoneNumberChange}
              className={errors.phone ? "border-red-500" : ""}
              placeholder="+251-xx-xxx-xxxx"
              disabled={isLoading}
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
              disabled={isLoading}
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
          <Label htmlFor="hireDate" className="text-right">
            Hire Date <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={(e) => {
                setFormData({ ...formData, hireDate: e.target.value });
                setErrors({ ...errors, hireDate: false });
              }}
              className={errors.hireDate ? "border-red-500" : ""}
              disabled={isLoading}
              required
            />
            {errors.hireDate && (
              <p className="text-sm text-red-500 mt-1">Hire date is required</p>
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
                  const value = parseFloat(e.target.value);
                  setFormData({ ...formData, salary: value });
                  setErrors({ ...errors, salary: false });
                }}
                className={`pl-12 ${errors.salary ? "border-red-500" : ""}`}
                disabled={isLoading}
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
          <Label htmlFor="employmentStatus" className="text-right">
            Employment Status <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.employmentStatus}
              onValueChange={(value) => {
                setFormData({ ...formData, employmentStatus: value });
                setErrors({ ...errors, employmentStatus: false });
              }}
              disabled={isLoading}
              required
            >
              <SelectTrigger className={errors.employmentStatus ? "border-red-500" : ""}>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full Time</SelectItem>
                <SelectItem value="part">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="intern">Intern</SelectItem>
              </SelectContent>
            </Select>
            {errors.employmentStatus && (
              <p className="text-sm text-red-500 mt-1">Employment status is required</p>
            )}
          </div>
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
              disabled={isLoading}
              required
            >
              <SelectTrigger className={errors.locationId ? "border-red-500" : ""}>
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
          <Label htmlFor="isActive" className="text-right">
            Active
          </Label>
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked as boolean })
            }
            disabled={isLoading}
          />
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : (initialData ? "Save changes" : "Add Employee")}
        </Button>
      </DialogFooter>
    </form>
  );
}
