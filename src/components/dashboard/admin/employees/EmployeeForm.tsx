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

// You'll need to create this type in your types directory
interface Employee {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
}

// You'll need to define these in your types file
const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
];

const positions = ["Junior", "Senior", "Lead", "Manager", "Director"];

interface EmployeeFormProps {
  initialData?: Employee;
  onSubmit: (data: Omit<Employee, "id">) => void;
}

export function EmployeeForm({ initialData, onSubmit }: EmployeeFormProps) {
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    department: initialData?.department || "",
    position: initialData?.position || "",
    isActive: initialData?.isActive || true,
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    department: false,
    position: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        department: initialData.department,
        position: initialData.position,
        isActive: initialData.isActive,
      });
      setErrors({
        firstName: false,
        lastName: false,
        email: false,
        department: false,
        position: false,
      });
    }
  }, [initialData]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      firstName: !formData.firstName.trim(),
      lastName: !formData.lastName.trim(),
      email: !formData.email.trim() || !validateEmail(formData.email),
      department: !formData.department,
      position: !formData.position,
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
          <Label htmlFor="firstName" className="text-right">
            First Name <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => {
                setFormData({ ...formData, firstName: e.target.value });
                setErrors({ ...errors, firstName: false });
              }}
              className={errors.firstName ? "border-red-500" : ""}
              required
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                First name is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => {
                setFormData({ ...formData, lastName: e.target.value });
                setErrors({ ...errors, lastName: false });
              }}
              className={errors.lastName ? "border-red-500" : ""}
              required
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">Last name is required</p>
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
                Valid email is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="department" className="text-right">
            Department <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.department}
              onValueChange={(value) => {
                setFormData({ ...formData, department: value });
                setErrors({ ...errors, department: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.department ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-red-500 mt-1">
                Department is required
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="position" className="text-right">
            Position <span className="text-red-500">*</span>
          </Label>
          <div className="col-span-3">
            <Select
              value={formData.position}
              onValueChange={(value) => {
                setFormData({ ...formData, position: value });
                setErrors({ ...errors, position: false });
              }}
              required
            >
              <SelectTrigger
                className={errors.position ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position} value={position}>
                    {position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.position && (
              <p className="text-sm text-red-500 mt-1">Position is required</p>
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
