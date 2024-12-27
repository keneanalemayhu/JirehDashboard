"use client";

import { Table, TableBody } from "@/components/ui/table";
import { Item } from "@/types/dashboard/business/item";
import { ItemTableHeader } from "./ItemTableHeader";
import { ItemTableRow } from "./ItemTableRow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ItemForm } from "./ItemForm";

interface ItemTableProps {
  items: Item[];
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
  onSort: (column: keyof Item) => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingItem: Item | null;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
}

export function ItemTable({
  items,
  columnsVisible,
  onSort,
  onEdit,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  editingItem,
  onEditSubmit,
  onDeleteConfirm,
}: ItemTableProps) {
  if (!items) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        Loading items...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-gray-500">
        No items found.
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <ItemTableHeader columnsVisible={columnsVisible} onSort={onSort} />
          <TableBody>
            {items.map((item) => (
              <ItemTableRow
                key={item.id}
                item={item}
                columnsVisible={columnsVisible}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Make changes to the item details.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <ItemForm initialData={editingItem} onSubmit={onEditSubmit} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
