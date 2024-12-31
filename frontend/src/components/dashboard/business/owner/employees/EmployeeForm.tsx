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
  EmployeeFormProps,
  EmployeeStatus,
} from "@/types/dashboard/business/employee";
import { format } from "date-fns";

const EMPLOYMENT_STATUSES = ["Active", "On Leave", "Suspended", "Terminated"];

export function EmployeeForm({
  initialData,
  onSubmit,
  locations,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    businessId: initialData?.businessId || 0,
    locationId: initialData?.locationId || 0,
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "+251",
    position: initialData?.position || "",
    salary: initialData?.salary || 0,
    status: initialData?.status || EmployeeStatus.FULL_TIME,
    employmentStatus: initialData?.employmentStatus || "Active",
    isActive: initialData?.isActive ?? true,
    hireDate: initialData?.hireDate
      ? format(initialData.hireDate, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  });

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    position: false,
    salary: false,
    status: false,
    locationId: false,
    employmentStatus: false,
    hireDate: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        businessId: initialData.businessId || 0,
        locationId: initialData.locationId || 0,
        name: initialData.name || "",
        email: initialData.email || "",
        phone: (initialData.phone ?? "").startsWith("+251")
          ? initialData.phone ?? ""
          : "+251" + (initialData.phone ?? ""),
        position: initialData.position || "",
        salary: initialData.salary || 0,
        status: initialData.status || EmployeeStatus.FULL_TIME,
        employmentStatus: initialData.employmentStatus || "Active",
        isActive: initialData.isActive ?? true,
        hireDate: initialData.hireDate
          ? format(initialData.hireDate, "yyyy-MM-dd")
          : "",
      });
      setErrors({
        name: false,
        email: false,
        phone: false,
        position: false,
        salary: false,
        status: false,
        locationId: false,
        employmentStatus: false,
        hireDate: false,
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !formData.name.trim(),
      email: !validateEmail(formData.email),
      phone: !formData.phone.trim() || formData.phone.length < 13,
      position: !formData.position.trim(),
      salary: formData.salary <= 0,
      status: !formData.status,
      locationId: formData.locationId === 0,
      employmentStatus: !formData.employmentStatus,
      hireDate: !formData.hireDate,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    onSubmit({
      ...formData,
      hireDate: new Date(formData.hireDate),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        {/* Location Selection */}
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

        {/* Name Field */}
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

        {/* Email Field */}
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
                Valid email is required
              </p>
            )}
          </div>
        </div>

        {/* Phone Field */}
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

        {/* Position Field */}
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
              required
            />
            {errors.position && (
              <p className="text-sm text-red-500 mt-1">Position is required</p>
            )}
          </div>
        </div>

        {/* Salary Field */}
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
                  setFormData({ ...formData, salary: Number(e.target.value) });
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

        {/* Status Field */}
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

        {/* Employment Status Field */}
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
              required
            >
              <SelectTrigger
                className={errors.employmentStatus ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employmentStatus && (
              <p className="text-sm text-red-500 mt-1">
                Employment status is required
              </p>
            )}
          </div>
        </div>

        {/* Hire Date Field */}
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
              required
            />
            {errors.hireDate && (
              <p className="text-sm text-red-500 mt-1">Hire date is required</p>
            )}
          </div>
        </div>

        {/* Active Status */}
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
