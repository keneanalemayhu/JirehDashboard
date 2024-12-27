"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, RotateCcw, AlertCircle } from "lucide-react";
import { Item, ColumnVisibility } from "@/types/dashboard/business/item";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCategories } from "@/hooks/dashboard/business/category";

interface ItemTableRowProps {
  item: Item;
  columnsVisible: ColumnVisibility;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  temporaryStatus?: string;
}

export function ItemTableRow({
  item,
  columnsVisible,
  onEdit,
  onDelete,
  temporaryStatus,
}: ItemTableRowProps) {
  const { categories } = useCategories();

  const getCategoryName = (categoryId: number) => {
    if (!categories?.length) return "No categories found";
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Category not found";
  };

  const formatPrice = (price: string) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
    }).format(parseFloat(price));
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

  const getVisibilityBadge = (isHidden: boolean) => {
    return (
      <Badge
        variant={isHidden ? "secondary" : "outline"}
        className="w-20 justify-center"
      >
        {isHidden ? "Hidden" : "Visible"}
      </Badge>
    );
  };

  const getTemporaryStatusBadge = (status: string | undefined) => {
    if (!status) return null;

    const config = {
      New: { variant: "default", icon: AlertCircle },
      Expired: { variant: "destructive", icon: AlertCircle },
    } as const;

    const isRemaining = status.includes("remaining");
    const variant = isRemaining
      ? "secondary"
      : config[status as keyof typeof config]?.variant || "default";
    const Icon = config[status as keyof typeof config]?.icon || AlertCircle;

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </Badge>
    );
  };

  const getAutoResetBadge = (autoReset: boolean) => {
    return (
      <Badge
        variant={autoReset ? "default" : "secondary"}
        className="flex items-center gap-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>{autoReset ? "Enabled" : "Disabled"}</span>
      </Badge>
    );
  };

  const getQuantityStatus = (quantity: number) => {
    if (quantity <= 0)
      return { color: "text-red-500", tooltip: "Out of stock" };
    if (quantity <= 10)
      return { color: "text-yellow-500", tooltip: "Low stock" };
    return { color: "text-green-500", tooltip: "In stock" };
  };

  if (!item) return null;

  const quantityStatus = getQuantityStatus(item.quantity);

  return (
    <TableRow className={item.isHidden ? "opacity-50" : ""}>
      {columnsVisible.id && (
        <TableCell className="font-mono text-sm">
          {item.id.toString().padStart(3, "0")}
        </TableCell>
      )}

      {columnsVisible.name && (
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            {item.name}
            {item.isTemporary && (
              <Tooltip>
                <TooltipTrigger>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Temporary Item</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </TableCell>
      )}

      {columnsVisible.barcode && (
        <TableCell className="font-mono text-sm">
          {item.barcode || "—"}
        </TableCell>
      )}

      {columnsVisible.price && (
        <TableCell className="font-medium">{formatPrice(item.price)}</TableCell>
      )}

      {columnsVisible.quantity && (
        <TableCell>
          <Tooltip>
            <TooltipTrigger>
              <span className={`font-medium ${quantityStatus.color}`}>
                {item.quantity}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{quantityStatus.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>
      )}

      {columnsVisible.categoryId && (
        <TableCell>
          <div className="flex items-center gap-2">
            {getCategoryName(item.categoryId)}
          </div>
        </TableCell>
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

      {/* Temporary Item specific columns */}
      {columnsVisible.expiryHours && item.isTemporary && (
        <TableCell className="text-center">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{item.expiryHours || 0}h</span>
          </Badge>
        </TableCell>
      )}

      {columnsVisible.autoResetQuantity && item.isTemporary && (
        <TableCell className="text-center">
          {getAutoResetBadge(item.autoResetQuantity)}
        </TableCell>
      )}

      {columnsVisible.temporaryStatus && item.isTemporary && (
        <TableCell className="text-center">
          {getTemporaryStatusBadge(temporaryStatus)}
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
            <span className="sr-only">Edit {item.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:text-destructive"
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
