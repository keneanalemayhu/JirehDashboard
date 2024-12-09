"use client";

import { Table, TableBody } from "@/components/ui/table";
import { Category } from "@/types/dashboard/admin/category";
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
  columnsVisible: {
    id: boolean;
    name: boolean;
    description: boolean;
    location: boolean;
  };
  onSort: (column: keyof Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  editingCategory: Category | null;
  onEditSubmit: () => void;
  onDeleteConfirm: () => void;
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
}: CategoryTableProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
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
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category details.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <CategoryForm
              initialData={editingCategory} // Make sure initialData matches the Category type
              onSubmit={onEditSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
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
