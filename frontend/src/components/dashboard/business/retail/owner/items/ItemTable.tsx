"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  Item,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/item";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ItemTableProps {
  items: Item[];
  columnsVisible: ColumnVisibility;
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
  activeTab?: "regular" | "temporary";
  onTabChange?: (tab: "regular" | "temporary") => void;
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
  activeTab = "regular",
  onTabChange,
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

  // Separate items into regular and temporary
  const regularItems = items.filter((item) => !item.isTemporary);
  const temporaryItems = items.filter((item) => item.isTemporary);

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

  const handleTabChange = (value: string) => {
    onTabChange?.(value as "regular" | "temporary");
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">
            Regular Items
            <Badge variant="secondary" className="ml-2">
              {regularItems.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="temporary">
            Temporary Items
            <Badge variant="secondary" className="ml-2">
              {temporaryItems.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regular">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <ItemTableHeader
                  columnsVisible={columnsVisible}
                  onSort={onSort}
                  showTemporaryColumns={false}
                />
                <TableBody>
                  {regularItems.map((item) => (
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
          </div>
        </TabsContent>

        <TabsContent value="temporary">
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <ItemTableHeader
                  columnsVisible={columnsVisible}
                  onSort={onSort}
                  showTemporaryColumns={true}
                />
                <TableBody>
                  {temporaryItems.map((item) => (
                    <ItemTableRow
                      key={item.id}
                      item={item}
                      columnsVisible={columnsVisible}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      temporaryStatus={getTemporaryItemStatus(item)}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.isTemporary ? "Edit Temporary Item" : "Edit Item"}
            </DialogTitle>
            <DialogDescription>
              Make changes to the {editingItem?.isTemporary ? "temporary " : ""}
              item details.
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <ItemForm
              initialData={editingItem}
              onSubmit={onEditSubmit}
              defaultTemporary={editingItem.isTemporary}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Delete {editingItem?.isTemporary ? "Temporary " : ""}Item
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this{" "}
              {editingItem?.isTemporary ? "temporary " : ""}item? This action
              cannot be undone.
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
