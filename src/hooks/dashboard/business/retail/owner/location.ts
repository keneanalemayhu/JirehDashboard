// src/hooks/dashboard/business/retail/admin/location.ts

import { useState, useMemo } from "react";
import {
  Location,
  LocationFormData,
  SortDirection,
} from "@/types/dashboard/business/retail/admin/location";

const initialLocations: Location[] = [
  {
    id: "LOC-001",
    name: "Main Branch",
    address: "123 Main St, City",
    phoneNumber: "+251-93-560-9939",
    isHidden: true,
  },
  {
    id: "LOC-002",
    name: "Bole Branch",
    address: "123 Main St, City",
    phoneNumber: "+251-91-234-5678",
    isHidden: false,
  },
  {
    id: "LOC-003",
    name: "Airport Branch",
    address: "456 Airport Rd, City",
    phoneNumber: "+251-98-765-4321",
    isHidden: false,
  },
  {
    id: "LOC-004",
    name: "Downtown Branch",
    address: "789 Elm St, City",
    phoneNumber: "+251-92-109-8765",
    isHidden: true,
  },
  {
    id: "LOC-005",
    name: "Subcity Branch",
    address: "321 Oak St, City",
    phoneNumber: "+251-95-432-1098",
    isHidden: false,
  },
  {
    id: "LOC-006",
    name: "Kirkos Branch",
    address: "654 Pine St, City",
    phoneNumber: "+251-91-876-5432",
    isHidden: true,
  },
  {
    id: "LOC-007",
    name: "Yeka Branch",
    address: "987 Cedar St, City",
    phoneNumber: "+251-96-543-2109",
    isHidden: false,
  },
  {
    id: "LOC-008",
    name: "Arada Branch",
    address: "210 Maple St, City",
    phoneNumber: "+251-93-210-9876",
    isHidden: true,
  },
  {
    id: "LOC-009",
    name: "Nifas Silk Lafto Branch",
    address: "543 Birch St, City",
    phoneNumber: "+251-97-876-5432",
    isHidden: false,
  },
  {
    id: "LOC-010",
    name: "Kolfe Keranio Branch",
    address: "109 Fir St, City",
    phoneNumber: "+251-92-109-8765",
    isHidden: true,
  },
];

export function useLocations(defaultLocations: Location[] = initialLocations) {
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
    phoneNumber: true,
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
        location.phoneNumber.toLowerCase().includes(filterValue.toLowerCase())
    );

    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortDirection === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
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
    const newId = `LOC-${String(locations.length + 1).padStart(3, "0")}`;

    const newLocation: Location = {
      id: newId,
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      isHidden: data.isHidden,
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
    locations,
    paginatedLocations,
    filteredLocations,
    editingLocation,
    setLocations,
    setEditingLocation,
    filterValue,
    setFilterValue,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    sortColumn,
    sortDirection,
    handleSort,
    handleAddLocation,
    handleEditLocation,
    handleDeleteLocation,
    handlePageChange,
    handlePageSizeChange,
  };
}
