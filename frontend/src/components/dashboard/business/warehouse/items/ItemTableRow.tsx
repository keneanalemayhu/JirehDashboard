"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Item } from "@/types/dashboard/business/item";
import { Badge } from "@/components/ui/badge";

// Define default column visibility
const DEFAULT_COLUMNS_VISIBLE = {
  id: true,
  name: true,
  price: true,
  category: true,
  barcode: true,
  quantity: true,
  isActive: true,
  isHidden: true,
};

interface ItemTableRowProps {
  item: Item;
  columnsVisible?: Partial<typeof DEFAULT_COLUMNS_VISIBLE>;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemTableRow({
  item,
  columnsVisible = DEFAULT_COLUMNS_VISIBLE,
  onEdit,
  onDelete,
}: ItemTableRowProps) {
  // Merge provided columns with defaults
  const visibleColumns = { ...DEFAULT_COLUMNS_VISIBLE, ...columnsVisible };

  const formatPrice = (price: string | undefined) => {
    if (typeof price !== "string" || !price) {
      return "N/A";
    }
    return parseFloat(price)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusBadge = (isActive: boolean | undefined) => {
    if (typeof isActive !== "boolean") {
      return (
        <Badge variant="secondary" className="w-20 justify-center">
          N/A
        </Badge>
      );
    }
    return (
      <Badge
        variant={isActive ? "success" : "secondary"}
        className="w-20 justify-center"
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const getVisibilityBadge = (isHidden: boolean | undefined) => {
    if (typeof isHidden !== "boolean") {
      return (
        <Badge variant="secondary" className="w-20 justify-center">
          N/A
        </Badge>
      );
    }
    return (
      <Badge
        variant={isHidden ? "secondary" : "outline"}
        className="w-20 justify-center"
      >
        {isHidden ? "Hidden" : "Visible"}
      </Badge>
    );
  };

  const getQuantityColor = (quantity: number | undefined) => {
    if (typeof quantity !== "number") {
      return "text-gray-500";
    }
    if (quantity <= 0) return "text-red-500";
    if (quantity <= 10) return "text-yellow-500";
    return "text-green-500";
  };

  if (!item) {
    return null;
  }

  return (
    <TableRow className={item.isHidden ? "opacity-50" : ""}>
      {visibleColumns.id && <TableCell>{item.id || "N/A"}</TableCell>}
      {visibleColumns.name && (
        <TableCell className="font-medium">{item.name || "N/A"}</TableCell>
      )}
      {visibleColumns.barcode && (
        <TableCell className="font-mono text-sm">
          {item.barcode || "—"}
        </TableCell>
      )}
      {visibleColumns.price && (
        <TableCell className="font-medium">
          ${formatPrice(item.price)}
        </TableCell>
      )}
      {visibleColumns.quantity && (
        <TableCell className={`font-medium ${getQuantityColor(item.quantity)}`}>
          {typeof item.quantity === "number" ? item.quantity : "N/A"}
        </TableCell>
      )}
      {visibleColumns.category && (
        <TableCell>{item.category || "N/A"}</TableCell>
      )}
      {visibleColumns.isActive && (
        <TableCell className="text-center">
          {getStatusBadge(item.isActive)}
        </TableCell>
      )}
      {visibleColumns.isHidden && (
        <TableCell className="text-center">
          {getVisibilityBadge(item.isHidden)}
        </TableCell>
      )}

      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
            className="hover:text-primary"
          >
            <Edit className="w-4 h-4" />
            <span className="sr-only">Edit {item.name || "Item"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {item.name || "Item"}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
