"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import {
  Category,
  ColumnVisibility,
} from "@/types/dashboard/business/owner/category";
import { format } from "date-fns";

interface CategoryTableRowProps {
  category: Category;
  columnsVisible: ColumnVisibility;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  getLocationName: (id: number) => string;
}

export function CategoryTableRow({
  category,
  columnsVisible,
  onEdit,
  onDelete,
  getLocationName,
}: CategoryTableRowProps) {
  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy HH:mm");
  };

  return (
    <TableRow className={category.isHidden ? "opacity-60" : ""}>
      {/* ID Column */}
      {columnsVisible.id && (
        <TableCell className="w-[100px] font-medium">{category.id}</TableCell>
      )}

      {/* Business ID Column */}
      {columnsVisible.businessId && (
        <TableCell className="w-[100px]">{category.businessId}</TableCell>
      )}

      {/* Location Column */}
      {columnsVisible.locationId && (
        <TableCell className="w-[150px]">
          {getLocationName(category.locationId)}
        </TableCell>
      )}

      {/* Name Column */}
      {columnsVisible.name && (
        <TableCell className="w-[200px] font-medium">{category.name}</TableCell>
      )}

      {/* Description Column */}
      {columnsVisible.description && (
        <TableCell className="max-w-[300px]">
          <div className="truncate">
            {category.description || "No description"}
          </div>
        </TableCell>
      )}

      {/* Status Columns */}
      {columnsVisible.isActive && (
        <TableCell className="w-[100px]">
          <Badge
            variant={category.isActive ? "success" : "secondary"}
            className="w-fit"
          >
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
      )}

      {columnsVisible.isHidden && (
        <TableCell className="w-[100px]">
          <Badge
            variant={category.isHidden ? "warning" : "outline"}
            className="w-fit"
          >
            {category.isHidden ? "Hidden" : "Visible"}
          </Badge>
        </TableCell>
      )}

      {/* Created By Column */}
      {columnsVisible.createdBy && (
        <TableCell className="w-[100px]">{category.createdBy}</TableCell>
      )}

      {/* Created At Column */}
      {columnsVisible.createdAt && (
        <TableCell className="w-[150px]">
          {formatDate(category.createdAt)}
        </TableCell>
      )}

      {/* Updated At Column */}
      {columnsVisible.updatedAt && (
        <TableCell className="w-[150px]">
          {formatDate(category.updatedAt)}
        </TableCell>
      )}

      {/* Actions Column */}
      <TableCell className="w-[100px] text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit {category.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {category.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
