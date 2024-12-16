"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { ItemTable } from "@/components/dashboard/business/retail/owner/items/ItemTable";
import { ItemTableSettings } from "@/components/dashboard/business/retail/owner/items/ItemTableSettings";
import { ItemTablePagination } from "@/components/dashboard/business/retail/owner/items/ItemTablePagination";
import { useItems } from "@/hooks/dashboard/business/retail/owner/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus, Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ItemForm } from "@/components/dashboard/business/retail/owner/items/ItemForm";
import { Item } from "@/types/dashboard/business/retail/owner/item";

interface ColumnVisibility {
  id: boolean;
  name: boolean;
  price: boolean;
  category: boolean;
  barcode: boolean;
  quantity: boolean;
  isActive: boolean;
  isHidden: boolean;
}

export default function ItemsPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

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

  // Calculate pagination
  const totalItems = filteredItems?.length || 0;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredItems?.slice(startIndex, endIndex) || [];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Export items
  const handleExport = () => {
    const csv = [
      // CSV Headers
      [
        "ID",
        "Name",
        "Barcode",
        "Price",
        "Quantity",
        "Category",
        "Status",
        "Visibility",
      ],
      // CSV Data
      ...filteredItems.map((item) => [
        item.id,
        item.name,
        item.barcode || "",
        item.price,
        item.quantity,
        item.category,
        item.isActive ? "Active" : "Inactive",
        item.isHidden ? "Hidden" : "Visible",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "items.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Items Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your inventory items, prices, and stock levels
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Items"
              >
                <Download className="h-4 w-4" />
              </Button>
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
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Filter items..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <ItemTableSettings
                columnsVisible={columnsVisible as ColumnVisibility}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {totalItems} items
              </div>
            </div>
          </div>

          {/* Table */}
          <ItemTable
            items={paginatedItems}
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
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
