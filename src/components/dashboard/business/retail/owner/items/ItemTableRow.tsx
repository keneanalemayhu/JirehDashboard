"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Item } from "@/types/dashboard/business/retail/owner/item";
import { Badge } from "@/components/ui/badge";

interface ItemTableRowProps {
  item: Item;
  columnsVisible: {
    id: boolean;
    name: boolean;
    price: boolean;
    category: boolean;
    barcode: boolean;
    quantity: boolean;
    isActive: boolean;
    isHidden: boolean;
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

  return (
    <TableRow className={item.isHidden ?? false ? "opacity-50" : ""}>
      {columnsVisible.id && (
        <TableCell>{typeof item.id === "string" ? item.id : "N/A"}</TableCell>
      )}
      {columnsVisible.name && (
        <TableCell className="font-medium">{item.name ?? "N/A"}</TableCell>
      )}
      {columnsVisible.barcode && (
        <TableCell className="font-mono text-sm">
          {item.barcode ?? "—"}
        </TableCell>
      )}
      {columnsVisible.price && (
        <TableCell className="font-medium">
          ${formatPrice(item.price)}
        </TableCell>
      )}
      {columnsVisible.quantity && (
        <TableCell className={`font-medium ${getQuantityColor(item.quantity)}`}>
          {typeof item.quantity === "number" ? item.quantity : "N/A"}
        </TableCell>
      )}
      {columnsVisible.category && (
        <TableCell>{item.category ?? "N/A"}</TableCell>
      )}
      {columnsVisible.isActive && (
        <TableCell className="text-center">
          {getStatusBadge(item.isActive)}
        </TableCell>
      )}
      {columnsVisible.isHidden && (
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
            <span className="sr-only">Edit {item.name ?? "Item"}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete {item.name ?? "Item"}</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
