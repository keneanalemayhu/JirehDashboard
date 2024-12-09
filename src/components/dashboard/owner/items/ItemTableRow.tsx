"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Item } from "@/types/dashboard/owner/item";

interface ItemTableRowProps {
  item: Item;
  columnsVisible: {
    id: boolean;
    name: boolean;
    price: boolean;
    category: boolean;
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
      {columnsVisible.id && <TableCell>{item.id}</TableCell>}
      {columnsVisible.name && <TableCell>{item.name}</TableCell>}
      {columnsVisible.price && (
        <TableCell>
          {parseFloat(item.price)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </TableCell>
      )}
      {columnsVisible.category && <TableCell>{item.category}</TableCell>}

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
