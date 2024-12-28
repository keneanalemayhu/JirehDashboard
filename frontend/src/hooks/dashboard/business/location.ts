// src/hooks/dashboard/business/owner/location.ts

"use client";

import { useState, useMemo } from "react";
import {
  Location,
  LocationFormData,
  SortDirection,
} from "@/types/dashboard/business/location";

const initialLocations: Location[] = [
  {
    id: 1,
    businessId: 1,
    name: "Main Branch",
    address: "123 Main St, Bole, Addis Ababa",
    contactNumber: "+251-93-560-9939",
    isActive: true,
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-01").toISOString(),
  },
  {
    id: 2,
    businessId: 1,
    name: "Airport Branch",
    address: "456 Airport Rd, Bole, Addis Ababa",
    contactNumber: "+251-91-234-5678",
    isActive: true,
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-01").toISOString(),
  },
  {
    id: 3,
    businessId: 1,
    name: "Warehouse",
    address: "789 Industrial Zone, Addis Ababa",
    contactNumber: "+251-98-765-4321",
    isActive: true,
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-01").toISOString(),
  },
];

export function useLocations(defaultLocations: Location[] = initialLocations) {
  // States
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [filterValue, setFilterValue] = useState("");
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [columnsVisible, setColumnsVisible] = useState({
    id: true,
    name: true,
    address: true,
    contactNumber: true,
    isActive: true,
    updatedAt: true,
  });
  const [sortColumn, setSortColumn] = useState<keyof Location | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering and sorting
  const filteredLocations = useMemo(() => {
    const locationsToFilter = locations || [];

    const result = locationsToFilter.filter(
      (location) =>
        location.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        location.address.toLowerCase().includes(filterValue.toLowerCase()) ||
        location.contactNumber.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return String(aValue).localeCompare(String(bValue));
        } else if (sortDirection === "desc") {
          return String(bValue).localeCompare(String(aValue));
        }
        return 0;
      });
    }

    return result;
  }, [locations, filterValue, sortColumn, sortDirection]);

  // Pagination
  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLocations.slice(startIndex, startIndex + pageSize);
  }, [filteredLocations, currentPage, pageSize]);

  // Get location name by ID - helper function
  const getLocationName = (locationId: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location?.name || "Unknown Location";
  };

  // Handlers
  const handleSort = (column: keyof Location) => {
    if (sortColumn === column) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return null;
        return "asc";
      });
      if (sortDirection === null) {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleAddLocation = (data: LocationFormData) => {
    const maxId = Math.max(...locations.map((l) => l.id), 0);
    const newId = maxId + 1;

    const newLocation: Location = {
      id: newId,
      businessId: 1, // This should come from context or props
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLocations((prev) => [...prev, newLocation]);
    setIsAddDialogOpen(false);
  };

  const handleEditLocation = (data: LocationFormData) => {
    if (!editingLocation) return;

    setLocations((prev) =>
      prev.map((location) =>
        location.id === editingLocation.id
          ? {
              ...location,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : location
      )
    );

    setIsEditDialogOpen(false);
    setEditingLocation(null);
  };

  const handleDeleteLocation = () => {
    if (!editingLocation) return;

    setLocations((prev) =>
      prev.filter((location) => location.id !== editingLocation.id)
    );

    setIsDeleteDialogOpen(false);
    setEditingLocation(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    // Data
    locations,
    paginatedLocations,
    filteredLocations,
    editingLocation,

    // State setters
    setLocations,
    setEditingLocation,

    // UI state
    filterValue,
    setFilterValue,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Table state
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,

    // Utility functions
    getLocationName,

    // Handlers
    handleSort,
    handleAddLocation,
    handleEditLocation,
    handleDeleteLocation,
    handlePageChange,
    handlePageSizeChange,
  };
}
