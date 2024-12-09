"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Location } from "@/types/dashboard/owner/location";

interface LocationTableRowProps {
  location: Location;
  columnsVisible: {
    id: boolean;
    name: boolean;
    address: boolean;
    phoneNumber: boolean;
  };
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export function LocationTableRow({
  location,
  columnsVisible,
  onEdit,
  onDelete,
}: LocationTableRowProps) {
  return (
    <TableRow className={location.isHidden ? "opacity-50" : ""}>
      {/* ID Column */}
      {columnsVisible.id && <TableCell>{location.id}</TableCell>}
      {/* Name Column */}
      {columnsVisible.name && <TableCell>{location.name}</TableCell>}
      {/* Address Column */}
      {columnsVisible.address && <TableCell>{location.address}</TableCell>}
      {/* Phone Number Column */}
      {columnsVisible.phoneNumber && (
        <TableCell>{location.phoneNumber}</TableCell>
      )}
      {/* Actions Column */}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(location)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {location.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(location)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {location.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
