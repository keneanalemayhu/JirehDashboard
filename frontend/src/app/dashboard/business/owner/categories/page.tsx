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
import { CirclePlus, Download, Search } from "lucide-react";
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
} from "@/types/dashboard/business/category";

export default function CategoriesPage() {
  const {
    categories,
    filteredCategories,
    paginatedCategories,
    editingCategory,
    locations,
    getLocationName,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    columnsVisible,
    setColumnsVisible,
    pageSize,
    currentPage,
    filters,
    handleFilterChange,
    handleSort,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    handlePageChange,
    handlePageSizeChange,
    setEditingCategory,
  } = useCategories();

  // Export categories
  const handleExport = () => {
    const headers = [
      "ID",
      "Location",
      "Name",
      "Description",
      "Status",
      "Visibility",
      "Created At",
      "Updated At",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredCategories.map((category) =>
        [
          category.id,
          `"${getLocationName(category.locationId)}"`,
          `"${category.name}"`,
          `"${category.description || ""}"`,
          category.isActive ? "Active" : "Inactive",
          category.isHidden ? "Hidden" : "Visible",
          new Date(category.createdAt).toLocaleDateString(),
          new Date(category.updatedAt).toLocaleDateString(),
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
                    <CirclePlus className="h-4 w-4 mr-2" />
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
                  <CategoryForm
                    onSubmit={handleAddCategory}
                    locations={locations}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange({ search: e.target.value })
                  }
                  className="pl-8"
                />
              </div>
              <CategoryTableSettings
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible({ ...columnsVisible, [column]: visible })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Total: {filteredCategories.length} categories
              </div>
            </div>
          </div>

          {/* Table */}
          <CategoryTable
            categories={paginatedCategories}
            columnsVisible={columnsVisible}
            onSort={handleSort}
            onEdit={(category: Category) => {
              setEditingCategory(category);
              setIsEditDialogOpen(true);
            }}
            onDelete={(category: Category) => {
              setEditingCategory(category);
              setIsDeleteDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            editingCategory={editingCategory}
            onEditSubmit={handleEditCategory}
            onDeleteConfirm={handleDeleteCategory}
            getLocationName={getLocationName}
            locations={locations}
          />

          {/* Pagination */}
          <CategoryTablePagination
            totalItems={filteredCategories.length}
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
