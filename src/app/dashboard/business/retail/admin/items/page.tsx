"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/admin/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/admin/Sidebar";
import { ItemTable } from "@/components/dashboard/business/retail/admin/items/ItemTable";
import { ItemTableSettings } from "@/components/dashboard/business/retail/admin/items/ItemTableSettings";
import { ItemTablePagination } from "@/components/dashboard/business/retail/admin/items/ItemTablePagination";
import { useItems } from "@/hooks/dashboard/business/retail/admin/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ItemForm } from "@/components/dashboard/business/retail/admin/items/ItemForm";

// Define interfaces for better type safety
interface Item {
  id: string;
  [key: string]: any;
}

interface ColumnVisibility {
  [key: string]: boolean;
}

export default function ItemsPage() {
  const {
    items,
    filterValue,
    setFilterValue,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingItem,
    setEditingItem,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredItems,
  } = useItems();

  // Calculate total items
  const totalItems = items?.length || 0;

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Items</h1>
              <p className="text-sm text-gray-500">Total items: {totalItems}</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CirclePlus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new item.
                  </DialogDescription>
                </DialogHeader>
                <ItemForm onSubmit={handleAddItem} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter items..."
              className="max-w-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <ItemTableSettings
              columnsVisible={columnsVisible as ColumnVisibility}
              onColumnVisibilityChange={(
                column: keyof ColumnVisibility,
                visible: boolean
              ) =>
                setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
              }
            />
          </div>

          {/* Table */}
          <ItemTable
            items={filteredItems ?? []}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(item: Item) => {
              setEditingItem(item);
              setIsEditDialogOpen(true);
            }}
            onDelete={(item: Item) => {
              setEditingItem(item);
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingItem={editingItem}
            onEditSubmit={handleEditItem}
            onDeleteConfirm={handleDeleteItem}
          />

          {/* Pagination */}
          <ItemTablePagination
            totalItems={filteredItems?.length ?? 0}
            pageSize={10}
            currentPage={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
