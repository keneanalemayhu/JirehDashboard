"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/warehouse/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/warehouse/Sidebar";
import { ItemTable } from "@/components/dashboard/business/retail/warehouse/items/ItemTable";
import { ItemTableSettings } from "@/components/dashboard/business/retail/warehouse/items/ItemTableSettings";
import { ItemTablePagination } from "@/components/dashboard/business/retail/warehouse/items/ItemTablePagination";
import { useItems } from "@/hooks/dashboard/business/retail/warehouse/item";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { Item } from "@/types/dashboard/business/retail/warehouse/item";

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
    handleEditItem,
    isEditDialogOpen,
    setIsEditDialogOpen,
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Inventory Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage and update stock levels for inventory items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Inventory"
              >
                <Download className="h-4 w-4" />
              </Button>
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
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            editingItem={editingItem}
            onEditSubmit={handleEditItem}
            showUpdateOnly={true} // Add this prop to indicate warehouse mode
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
