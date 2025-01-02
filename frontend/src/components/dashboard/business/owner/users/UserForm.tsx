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
import { Role } from "@/types/dashboard/business/user";
import { useLocations } from "@/hooks/dashboard/business/location";

interface User {
  id?: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  location_id: string;
  location: string;
  role: Role;
  isActive: boolean;
  
}

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: User) => void;
  isLoading?: boolean;
}



export function UserForm({ initialData, onSubmit, isLoading = false }: UserFormProps) {
  const { locations, isLoading: isLoadingLocations } = useLocations();
  const [formData, setFormData] = useState<Omit<User, "id">>({
    username: initialData?.username || "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "+251",
    location_id: initialData?.location_id || "",
    location :initialData?.location || "",
    role: initialData?.role || Role.ADMIN,
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState({
    username: false,
    name: false,
    email: false,
    phone: false,
    location_id: false,
    role: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username,
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone.startsWith("+251")
          ? initialData.phone
          : "+251" + initialData.phone,
        location_id: initialData.location_id,
        location: initialData.location,
        role: initialData.role,
        isActive: initialData.isActive ?? true,
      });
      setErrors({
        username: false,
        name: false,
        email: false,
        phone: false,
        location_id: false,
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
    return numbers;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {
      username: !formData.username,
      name: !formData.name,
      email: !validateEmail(formData.email),
      phone: formData.phone.length !== 13,
      location_id: !formData.location_id,
      role: !formData.role,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">Username is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">Full name is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Valid email is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: formatPhoneNumber(e.target.value),
              })
            }
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Valid phone number is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select
  value={formData.location_id}
  onValueChange={(value) =>
    setFormData({ ...formData, location_id: value })
  }
>
  <SelectTrigger className={errors.location_id ? "border-red-500" : ""}>
    <SelectValue placeholder="Select location" />
  </SelectTrigger>
  <SelectContent>
    {isLoadingLocations ? (
      <SelectItem value="loading" disabled>
        Loading locations...
      </SelectItem>
    ) : (
      locations.map((location) => (
        <SelectItem key={location.id} value={location.id.toString()}>
          {location.name}
        </SelectItem>
      ))
    )}
  </SelectContent>
</Select>
{errors.location_id && (
  <p className="text-red-500 text-sm">Location is required</p>
)}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) =>
              setFormData({ ...formData, role: value as Role })
            }
          >
            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.ADMIN}>Admin</SelectItem>
              <SelectItem value={Role.SALES}>Sales</SelectItem>
              <SelectItem value={Role.WAREHOUSE_MANAGER}>Warehouse Manager</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-red-500 text-sm">Role is required</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked as boolean })
          }
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </form>
  );
}
