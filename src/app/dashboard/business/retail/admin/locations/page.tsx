"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/admin/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/admin/Sidebar";
import { LocationTable } from "@/components/dashboard/business/retail/admin/locations/LocationTable";
import { LocationTableSettings } from "@/components/dashboard/business/retail/admin/locations/LocationTableSettings";
import { LocationTablePagination } from "@/components/dashboard/business/retail/admin/locations/LocationTablePagination";
import { useLocations } from "@/hooks/dashboard/business/retail/admin/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationForm } from "@/components/dashboard/business/retail/admin/locations/LocationForm";

// Define interfaces for our component
interface Location {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
}

interface LocationFormData {
  name: string;
  address: string;
  phoneNumber: string;
}

interface ColumnsVisibility {
  id: boolean;
  name: boolean;
  address: boolean;
  phoneNumber: boolean;
}

export default function LocationsPage() {
  const {
    locations,
    filterValue,
    setFilterValue,
    handleAddLocation,
    handleEditLocation,
    handleDeleteLocation,
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
  } = useLocations();

  // Use the locations array to display total count
  const totalLocations = locations?.length || 0;

  const handleEditSubmit = (data: LocationFormData) => {
    if (editingLocation) {
      handleEditLocation({ ...data, id: editingLocation.id });
    }
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Locations</h1>
              <p className="text-sm text-gray-500">
                Total locations: {totalLocations}
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CirclePlus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new location.
                  </DialogDescription>
                </DialogHeader>
                <LocationForm onSubmit={handleAddLocation} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter locations..."
              className="max-w-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <LocationTableSettings
              columnsVisible={columnsVisible as ColumnsVisibility}
              onColumnVisibilityChange={(
                column: keyof ColumnsVisibility,
                visible: boolean
              ) =>
                setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
              }
            />
          </div>

          {/* Table */}
          <LocationTable
            locations={filteredLocations ?? []}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(location: Location) => {
              setEditingLocation(location);
              setIsEditDialogOpen(true);
            }}
            onDelete={(location: Location) => {
              setEditingLocation(location);
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingLocation={editingLocation}
            onEditSubmit={handleEditSubmit}
            onDeleteConfirm={handleDeleteLocation}
          />

          {/* Pagination */}
          <LocationTablePagination
            totalItems={filteredLocations?.length ?? 0}
            pageSize={10}
            currentPage={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
