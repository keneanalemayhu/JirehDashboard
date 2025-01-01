"use client";

import { Table, TableBody } from "@/components/ui/table";
import { Item } from "@/types/dashboard/business/item";
import { ItemTableHeader } from "./ItemTableHeader";
import { ItemTableRow } from "./ItemTableRow";

interface ItemTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  locationId: number;
}

export function ItemTable({ items, onEdit, onDelete, locationId }: ItemTableProps) {
  if (!items || items.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        No items found.
      </div>
    );
  }

  // Calculate status for temporary items
  const getTemporaryItemStatus = (item: Item) => {
    if (!item.lastQuantityReset) return "New";
    const expiryTime = new Date(item.lastQuantityReset);
    expiryTime.setHours(expiryTime.getHours() + (item.expiryHours || 0));
    const now = new Date();

    if (now > expiryTime) return "Expired";

    const hoursRemaining = Math.ceil(
      (expiryTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    );
    return `${hoursRemaining}h remaining`;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <ItemTableHeader />
        <TableBody>
          {items.map((item) => (
            <ItemTableRow
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}
              temporaryStatus={item.isTemporary ? getTemporaryItemStatus(item) : undefined}
              locationId={locationId}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
