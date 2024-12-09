"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  Location,
  ColumnVisibility,
  LocationFormData,
} from "@/types/dashboard/admin/location";
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
  onDeleteConfirm: (location: Location) => void;
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
}: LocationTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <LocationTableHeader
            columnsVisible={columnsVisible}
            onSort={onSort}
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
              Are you sure you want to delete this location? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                editingLocation && onDeleteConfirm(editingLocation)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
