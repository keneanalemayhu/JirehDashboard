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
import { CirclePlus, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ItemForm } from "@/components/dashboard/business/retail/owner/items/ItemForm";
import { useCategories } from "@/hooks/dashboard/business/retail/owner/category";

export default function ItemsPage() {
  const { categories } = useCategories();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState<"regular" | "temporary">(
    "regular"
  );

  const {
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
    handleTabChange: hookHandleTabChange,
  } = useItems();

  // Separate regular and temporary items
  const regularItems = filteredItems.filter((item) => !item.isTemporary);
  const temporaryItems = filteredItems.filter((item) => item.isTemporary);

  // Get current items based on active tab
  const currentItems = activeTab === "regular" ? regularItems : temporaryItems;

  // Calculate pagination
  const totalItems = currentItems.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = currentItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "regular" | "temporary");
    hookHandleTabChange(value as "regular" | "temporary");
    setCurrentPage(1);
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Barcode",
      "Price",
      "Quantity",
      "Category",
      "Status",
      "Visibility",
      "Is Temporary",
      "Expiry Hours",
      "Auto Reset",
      "Last Reset",
    ];

    const csv = [
      headers,
      ...currentItems.map((item) => {
        const category =
          categories?.find((c) => c.id === item.categoryId)?.name || "";
        return [
          item.id,
          item.name,
          item.barcode || "",
          item.price,
          item.quantity,
          category,
          item.isActive ? "Active" : "Inactive",
          item.isHidden ? "Hidden" : "Visible",
          item.isTemporary ? "Yes" : "No",
          item.expiryHours || "",
          item.autoResetQuantity ? "Yes" : "No",
          item.lastQuantityReset
            ? new Date(item.lastQuantityReset).toISOString()
            : "",
        ];
      }),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}-items.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Items Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your inventory items, including regular and temporary
                items
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
                    Add {activeTab === "temporary" ? "Temporary " : ""}Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Add New {activeTab === "temporary" ? "Temporary " : ""}
                      Item
                    </DialogTitle>
                    <DialogDescription>
                      Enter the details for the new{" "}
                      {activeTab === "temporary" ? "temporary " : ""}item.
                    </DialogDescription>
                  </DialogHeader>
                  <ItemForm
                    onSubmit={handleAddItem}
                    defaultTemporary={activeTab === "temporary"}
                  />
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
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
                showTemporaryColumns={activeTab === "temporary"}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {totalItems} items
              </div>
            </div>
          </div>

          <ItemTable
            items={paginatedItems}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(item) => {
              setEditingItem(item);
              setIsEditDialogOpen(true);
            }}
            onDelete={(item) => {
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
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <ItemTablePagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            itemType={activeTab}
            totalRegularItems={regularItems.length}
            totalTemporaryItems={temporaryItems.length}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
