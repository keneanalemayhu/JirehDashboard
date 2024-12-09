"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/types/dashboard/owner/category";

interface CategoryTableRowProps {
  category: Category;
  columnsVisible: {
    id: boolean;
    name: boolean;
    description: boolean;
    location: boolean;
  };
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTableRow({
  category,
  columnsVisible,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  return (
    <TableRow className={category.isHidden ? "opacity-50" : ""}>
      {/* ID Column */}
      {columnsVisible.id && <TableCell>{category.id}</TableCell>}

      {/* Name Column */}
      {columnsVisible.name && <TableCell>{category.name}</TableCell>}

      {/* Description Column */}
      {columnsVisible.description && (
        <TableCell>{category.description}</TableCell>
      )}

      {/* Location Column */}
      {columnsVisible.location && <TableCell>{category.location}</TableCell>}

      {/* Actions Column */}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {category.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {category.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}