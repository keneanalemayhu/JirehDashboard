"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, RotateCcw, AlertCircle } from "lucide-react";
import { Item } from "@/types/dashboard/business/item";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/dashboard/business/category";

interface ItemTableRowProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  temporaryStatus?: string;
  locationId: number;
}

export function ItemTableRow({
  item,
  onEdit,
  onDelete,
  temporaryStatus,
  locationId,
}: ItemTableRowProps) {
  const { categories } = useCategories(locationId);

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

  return (
    <TableRow>
      <TableCell>{item.id}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.barcode}</TableCell>
      <TableCell>{formatPrice(item.price)}</TableCell>
      <TableCell>{item.quantity}</TableCell>
      <TableCell>{getCategoryName(item.categoryId)}</TableCell>
      <TableCell>{getStatusBadge(item.isActive)}</TableCell>
      <TableCell>{getVisibilityBadge(item.isHidden)}</TableCell>
      <TableCell>
        {item.isTemporary && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{item.expiryHours}h</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        {item.isTemporary && getAutoResetBadge(item.autoResetQuantity)}
      </TableCell>
      <TableCell>
        {item.isTemporary && getTemporaryStatusBadge(temporaryStatus)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(item)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
