// src/hooks/dashboard/business/location.ts

"use client";

import { useState, useEffect } from "react";
import { Location, LocationFormData } from "@/types/dashboard/business/location";
import { locationApi } from "@/lib/api/location";
import { useOwnerStore } from "./store";
import { toast } from "sonner";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    address: true,
    contactNumber: true,
    isActive: true,
    updatedAt: true,
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Location;
    direction: "asc" | "desc";
  } | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { store, isLoading: isLoadingStore } = useOwnerStore();

  // Load locations
  useEffect(() => {
    if (store) {
      loadLocations();
    }
  }, [store]);

  const loadLocations = async () => {
    if (!store) {
      toast.error("No store found. Please contact support.");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await locationApi.getLocations(store.id);
      setLocations(data);
    } catch (err) {
      console.error("Error loading locations:", err);
      toast.error("Failed to load locations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add location
  const handleAddLocation = async (data: LocationFormData) => {
    if (!store) {
      toast.error("No store found. Please contact support.");
      return;
    }

    setIsLoading(true);
    try {
      const location = await locationApi.createLocation(store.id, data);
      setLocations(prev => [...prev, location]);
      setIsAddDialogOpen(false);
      toast.success("Location created successfully!");
    } catch (err: any) {
      console.error("Error creating location:", err);
      toast.error(err.response?.data?.errors || "Failed to create location");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit location
  const handleEditLocation = async (data: LocationFormData) => {
    if (!store || !editingLocation) return;

    setIsLoading(true);
    try {
      const updatedLocation = await locationApi.updateLocation(
        store.id,
        editingLocation.id,
        data
      );
      setLocations(prev =>
        prev.map(loc => (loc.id === updatedLocation.id ? updatedLocation : loc))
      );
      setIsEditDialogOpen(false);
      setEditingLocation(null);
      toast.success("Location updated successfully!");
    } catch (err: any) {
      console.error("Error updating location:", err);
      toast.error(err.response?.data?.errors || "Failed to update location");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete location
  const handleDeleteClick = (location: Location) => {
    setDeletingLocation(location);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!store || !deletingLocation) return;

    setIsLoading(true);
    try {
      await locationApi.deleteLocation(store.id, deletingLocation.id);
      setLocations(prev => prev.filter(loc => loc.id !== deletingLocation.id));
      setIsDeleteDialogOpen(false);
      setDeletingLocation(null);
      toast.success("Location deleted successfully!");
    } catch (err) {
      console.error("Error deleting location:", err);
      toast.error("Failed to delete location");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sort
  const handleSort = (key: keyof Location) => {
    setSortConfig(current => {
      if (!current || current.key !== key) {
        return { key, direction: "asc" };
      }
      if (current.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null;
    });
  };

  // Filter and sort locations
  const filteredLocations = locations
    .filter(location => {
      if (!filterValue) return true;
      const searchValue = filterValue.toLowerCase();
      return (
        location.name.toLowerCase().includes(searchValue) ||
        location.address.toLowerCase().includes(searchValue) ||
        location.contactNumber.toLowerCase().includes(searchValue)
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

  return {
    locations,
    filterValue,
    setFilterValue,
    handleAddLocation,
    handleEditLocation,
    handleDeleteClick,
    handleDeleteConfirm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingLocation,
    setEditingLocation,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredLocations,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isLoading: isLoading || isLoadingStore,
    store,
  };
}
