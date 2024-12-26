"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Location,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/location";
import { Badge } from "@/components/ui/badge";

interface LocationTableRowProps {
  location: Location;
  columnsVisible: ColumnVisibility;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

export function LocationTableRow({
  location,
  columnsVisible,
  onEdit,
  onDelete,
}: LocationTableRowProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge
        variant={isActive ? "default" : "secondary"}
        className="w-20 justify-center"
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  return (
    <TableRow className={!location.isActive ? "opacity-50" : ""}>
      {/* ID Column */}
      {columnsVisible.id && (
        <TableCell className="font-mono text-sm">
          {location.id.toString().padStart(3, "0")}
        </TableCell>
      )}

      {/* Name Column */}
      {columnsVisible.name && (
        <TableCell className="font-medium">{location.name}</TableCell>
      )}

      {/* Address Column */}
      {columnsVisible.address && <TableCell>{location.address}</TableCell>}

      {/* Contact Number Column */}
      {columnsVisible.contactNumber && (
        <TableCell>{location.contactNumber}</TableCell>
      )}

      {/* Status Column */}
      {columnsVisible.isActive && (
        <TableCell className="text-center">
          {getStatusBadge(location.isActive)}
        </TableCell>
      )}

      {/* Last Updated Column */}
      {columnsVisible.updatedAt && (
        <TableCell className="text-muted-foreground text-sm">
          {formatDate(location.updatedAt)}
        </TableCell>
      )}

      {/* Actions Column */}
      <TableCell>
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(location)}
            className="hover:text-primary"
          >
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {location.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
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
