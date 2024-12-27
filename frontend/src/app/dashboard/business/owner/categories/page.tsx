"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { CategoryTable } from "@/components/dashboard/business/owner/categories/CategoryTable";
import { CategoryTableSettings } from "@/components/dashboard/business/owner/categories/CategoryTableSettings";
import { CategoryTablePagination } from "@/components/dashboard/business/owner/categories/CategoryTablePagination";
import { useCategories } from "@/hooks/dashboard/business/category";
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
import { CategoryForm } from "@/components/dashboard/business/owner/categories/CategoryForm";
import {
  Category,
  CategoryFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/category";

export default function CategoriesPage() {
  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    categories,
    filterValue,
    setFilterValue,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingCategory,
    setEditingCategory,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredCategories,
  } = useCategories();

  // Calculate pagination
  const totalCategories = filteredCategories?.length || 0;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCategories =
    filteredCategories?.slice(startIndex, endIndex) || [];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size changes
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Handle edit submit
  const handleEditSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      handleEditCategory({
        ...data,
        id: editingCategory.id,
      });
    }
  };

  // Export categories
  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Description",
      "Items Count",
      "Status",
      "Visibility",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredCategories.map((category) =>
        [
          category.id,
          `"${category.name}"`,
          `"${category.description || ""}"`,
          category.itemsCount || 0,
          category.isActive ? "Active" : "Inactive",
          category.isHidden ? "Hidden" : "Visible",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `categories-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                Categories Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your product categories and organization
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                title="Export Categories"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new category.
                    </DialogDescription>
                  </DialogHeader>
                  <CategoryForm onSubmit={handleAddCategory} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Filter categories..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <CategoryTableSettings
                columnsVisible={columnsVisible as ColumnVisibility}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {totalCategories} categories
              </div>
            </div>
          </div>

          {/* Table */}
          <CategoryTable
            categories={paginatedCategories}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(category: Category) => {
              setEditingCategory({
                ...category,
                isHidden: category.isHidden ?? false,
              });
              setIsEditDialogOpen(true);
            }}
            onDelete={(category: Category) => {
              setEditingCategory({
                ...category,
                isHidden: category.isHidden ?? false,
              });
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingCategory={editingCategory}
            onEditSubmit={handleEditSubmit}
            onDeleteConfirm={handleDeleteCategory}
          />

          {/* Pagination */}
          <CategoryTablePagination
            totalItems={totalCategories}
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
