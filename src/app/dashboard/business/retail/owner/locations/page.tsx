"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { LocationTable } from "@/components/dashboard/business/retail/owner/locations/LocationTable";
import { LocationTableSettings } from "@/components/dashboard/business/retail/owner/locations/LocationTableSettings";
import { LocationTablePagination } from "@/components/dashboard/business/retail/owner/locations/LocationTablePagination";
import { useLocations } from "@/hooks/dashboard/business/retail/owner/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationForm } from "@/components/dashboard/business/retail/owner/locations/LocationForm";
import { Location } from "@/types/dashboard/business/retail/owner/location";

interface ColumnsVisibility {
  id: boolean;
  name: boolean;
  address: boolean;
  phoneNumber: boolean;
  isActive: boolean;
}

export default function LocationsPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

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

  // Calculate pagination
  const totalLocations = filteredLocations?.length || 0;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLocations =
    filteredLocations?.slice(startIndex, endIndex) || [];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Export locations
  const handleExport = () => {
    const headers = ["ID", "Name", "Address", "Phone Number", "Status"];

    const csvContent = [
      headers.join(","),
      ...filteredLocations.map((location) =>
        [
          location.id,
          `"${location.name}"`,
          `"${location.address}"`,
          `"${location.phoneNumber}"`,
          location.isActive ? "Active" : "Inactive",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `locations-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Locations Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your store locations and branches
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Locations"
              >
                <Download className="h-4 w-4" />
              </Button>
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
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Filter locations..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <LocationTableSettings
                columnsVisible={columnsVisible as ColumnsVisibility}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {totalLocations} locations
              </div>
            </div>
          </div>

          {/* Table */}
          <LocationTable
            locations={paginatedLocations}
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
            onEditSubmit={handleEditLocation}
            onDeleteConfirm={handleDeleteLocation}
          />

          {/* Pagination */}
          <LocationTablePagination
            totalItems={totalLocations}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
