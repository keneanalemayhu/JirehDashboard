"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/admin/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/admin/Sidebar";
import { CategoryTable } from "@/components/dashboard/business/retail/admin/categories/CategoryTable";
import { CategoryTableSettings } from "@/components/dashboard/business/retail/admin/categories/CategoryTableSettings";
import { CategoryTablePagination } from "@/components/dashboard/business/retail/admin/categories/CategoryTablePagination";
import { useCategories } from "@/hooks/dashboard/business/retail/admin/category";
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
import { CategoryForm } from "@/components/dashboard/business/retail/admin/categories/CategoryForm";
import {
  Category,
  CategoryFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/admin/category";

export default function CategoriesPage() {
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

  // Calculate total categories
  const totalCategories = categories?.length || 0;

  const handleEditSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      handleEditCategory({
        ...data,
        id: editingCategory.id,
      });
    }
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Categories</h1>
              <p className="text-sm text-gray-500">
                Total categories: {totalCategories}
              </p>
            </div>
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

          {/* Filter and Settings */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter categories..."
              className="max-w-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <CategoryTableSettings
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
          <CategoryTable
            categories={filteredCategories ?? []}
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
            totalItems={filteredCategories?.length ?? 0}
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
