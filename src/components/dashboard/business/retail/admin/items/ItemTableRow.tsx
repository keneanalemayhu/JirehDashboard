"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Item } from "@/types/dashboard/business/retail/admin/item";

interface ItemTableRowProps {
  item: Item;
  columnsVisible: {
    id: boolean;
    name: boolean;
    description: boolean;
    location: boolean;
  };
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemTableRow({
  item,
  columnsVisible,
  onEdit,
  onDelete,
}: ItemTableRowProps) {
  return (
    <TableRow className={item.isHidden ? "opacity-50" : ""}>
      {/* ID Column */}
      {columnsVisible.id && <TableCell>{item.id}</TableCell>}

      {/* Name Column */}
      {columnsVisible.name && <TableCell>{item.name}</TableCell>}

      {/* Description Column */}
      {columnsVisible.description && <TableCell>{item.description}</TableCell>}

      {/* Location Column */}
      {columnsVisible.location && <TableCell>{item.location}</TableCell>}

      {/* Actions Column */}
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {item.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {item.name}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
