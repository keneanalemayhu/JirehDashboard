"use client";

import { Table, TableBody } from "@/components/ui/table";
import {
  Category,
  CategoryFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/category";
import { CategoryTableHeader } from "./CategoryTableHeader";
import { CategoryTableRow } from "./CategoryTableRow";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "./CategoryForm";

interface CategoryTableProps {
  categories: Category[];
  columnsVisible: ColumnVisibility;
  onSort: (column: keyof Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingCategory: Category | null;
  onEditSubmit: (data: CategoryFormData) => void;
  onDeleteConfirm: () => void;
  locations: Array<{ id: number; name: string }>;
  getLocationName: (id: number) => string;
  businessId: number;
  userId: number;
}

export function CategoryTable({
  categories,
  columnsVisible,
  onSort,
  onEdit,
  onDelete,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  editingCategory,
  onEditSubmit,
  onDeleteConfirm,
  locations,
  getLocationName,
  businessId,
  userId,
}: CategoryTableProps) {
  // Loading state
  if (!categories) {
    return (
      <div className="rounded-md border p-8">
        <div className="text-center text-sm text-muted-foreground">
          Loading categories...
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="rounded-md border p-8">
        <div className="text-center text-sm text-muted-foreground">
          No categories found.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="relative">
        <Table>
          <CategoryTableHeader
            columnsVisible={columnsVisible}
            onSort={onSort}
          />
          <TableBody>
            {categories.map((category) => (
              <CategoryTableRow
                key={category.id}
                category={category}
                columnsVisible={columnsVisible}
                onEdit={onEdit}
                onDelete={onDelete}
                getLocationName={getLocationName}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category details. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialData={editingCategory}
              onSubmit={onEditSubmit}
              locations={locations}
              businessId={businessId}
              userId={userId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone and may affect related items.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
