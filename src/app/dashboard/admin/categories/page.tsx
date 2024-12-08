"use client";

import * as React from "react";
import { AppSidebar } from "@/components/dashboard/Admin/AdminSidebar";
import { NavActions } from "@/components/dashboard/Admin/AdminNavAction";
import { CategoryTable } from "@/components/dashboard/Admin/categories/CategoryTable";
import { CategoryTableSettings } from "@/components/dashboard/Admin/categories/CategoryTableSettings";
import { CategoryTablePagination } from "@/components/dashboard/Admin/categories/CategoryTablePagination";
import { useCategories } from "@/hooks/dashboard/admin/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CategoryForm } from "@/components/dashboard/Admin/categories/CategoryForm";

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>JirehDashboard</p>
          </div>
          <div className="ml-auto px-3">
            <NavActions />
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="flex flex-col gap-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Categories</h1>
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
                columnsVisible={columnsVisible}
                onColumnVisibilityChange={(column, visible) =>
                  setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
                }
              />
            </div>

            {/* Table */}
            <CategoryTable
              categories={filteredCategories}
              columnsVisible={columnsVisible}
              onSort={handleSort}
              onEdit={(category) => {
                setEditingCategory(category);
                setIsEditDialogOpen(true);
              }}
              onDelete={(category) => {
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
            />

            {/* Pagination */}
            <CategoryTablePagination
              totalItems={filteredCategories.length}
              pageSize={10}
              currentPage={1}
              onPageChange={() => {}}
              onPageSizeChange={() => {}}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}