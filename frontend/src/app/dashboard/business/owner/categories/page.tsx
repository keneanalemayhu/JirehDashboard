"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { CategoryTable } from "@/components/dashboard/business/owner/categories/CategoryTable";
import { useCategories } from "@/hooks/dashboard/business/category";
import { useLocations } from "@/hooks/dashboard/business/location";
import { Button } from "@/components/ui/button";
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

export default function CategoriesPage() {
  const [selectedLocationId, setSelectedLocationId] = React.useState<number | null>(null);
  const { locations } = useLocations();
  const {
    categories,
    loading,
    error,
    editingCategory,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
    setEditingCategory,
  } = useCategories(selectedLocationId || 0);

  React.useEffect(() => {
    if (locations && locations.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations]);

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
      ...categories.map((category) =>
        [
          category.id,
          category.locationId,
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedLocationId) return <div>Please select a location</div>;

  return (
    <SidebarLayout>
      <Header />
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Categories</h1>
          <div className="flex items-center gap-4">
            <select
              className="border p-2 rounded"
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(Number(e.target.value))}
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
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
                  <DialogTitle>Add Category</DialogTitle>
                  <DialogDescription>
                    Add a new category to your inventory
                  </DialogDescription>
                </DialogHeader>
                <CategoryForm
                  onSubmit={(data) => handleAddCategory({ ...data, locationId: selectedLocationId })}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <CategoryTable
            categories={categories}
            onEdit={(category) => {
              setEditingCategory(category);
              setIsEditDialogOpen(true);
            }}
            onDelete={(category) => {
              setEditingCategory(category);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update category information
              </DialogDescription>
            </DialogHeader>
            {editingCategory && (
              <CategoryForm
                initialData={editingCategory}
                onSubmit={handleEditCategory}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteCategory()}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
}
