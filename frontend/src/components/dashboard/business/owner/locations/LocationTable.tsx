"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  Location,
  ColumnVisibility,
  LocationFormData,
} from "@/types/dashboard/business/location";
import { LocationTableHeader } from "./LocationTableHeader";
import { LocationTableRow } from "./LocationTableRow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationForm } from "./LocationForm";

interface LocationTableProps {
  locations: Location[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingLocation: Location | null;
  onEditSubmit: (data: LocationFormData) => void;
  onDeleteConfirm: () => void;
  sortColumn?: keyof Location | null;
  sortDirection?: "asc" | "desc" | null;
}

export function LocationTable({
  locations,
  columnsVisible,
  onSort,
  onEdit,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  editingLocation,
  onEditSubmit,
  onDeleteConfirm,
  sortColumn,
  sortDirection,
}: LocationTableProps) {
  if (!locations) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        Loading locations...
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        No locations found.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <LocationTableHeader
            columnsVisible={columnsVisible}
            onSort={onSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          <TableBody>
            {locations.map((location) => (
              <LocationTableRow
                key={location.id}
                location={location}
                columnsVisible={columnsVisible}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>
              Make changes to the location details.
            </DialogDescription>
          </DialogHeader>
          {editingLocation && (
            <LocationForm
              initialData={editingLocation}
              onSubmit={onEditSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{editingLocation?.name}
              &quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
