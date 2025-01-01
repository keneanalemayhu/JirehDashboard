"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { ItemTable } from "@/components/dashboard/business/owner/items/ItemTable";
import { useItems } from "@/hooks/dashboard/business/item";
import { useCategories } from "@/hooks/dashboard/business/category";
import { useLocations } from "@/hooks/dashboard/business/location";
import { Button } from "@/components/ui/button";
import { CirclePlus, Download, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ItemForm } from "@/components/dashboard/business/owner/items/ItemForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "sonner";
import { Input } from "@/components/ui/input";

export default function ItemsPage() {
  const [selectedLocationId, setSelectedLocationId] = React.useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<number | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const { locations } = useLocations();
  const { categories } = useCategories(selectedLocationId || 0);
  const {
    items,
    loading,
    error,
    editingItem,
    activeTab,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleTabChange,
    setEditingItem,
  } = useItems(selectedCategoryId || 0);

  React.useEffect(() => {
    if (locations && locations.length > 0 && !selectedLocationId) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations]);

  React.useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    } else if (categories && categories.length === 0) {
      setSelectedCategoryId(null);
    }
  }, [categories]);

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

    const csvContent = [
      headers.join(","),
      ...items.map((item) => {
        const category = categories?.find((c) => c.id === item.categoryId)?.name || "";
        return [
          item.id,
          `"${item.name}"`,
          `"${item.barcode}"`,
          item.price,
          item.quantity,
          `"${category}"`,
          item.isActive ? "Active" : "Inactive",
          item.isHidden ? "Hidden" : "Visible",
          item.isTemporary ? "Yes" : "No",
          item.expiryHours || "",
          item.autoResetQuantity ? "Yes" : "No",
          item.lastQuantityReset
            ? new Date(item.lastQuantityReset).toLocaleDateString()
            : "",
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `items-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const categoryName = categories?.find((c) => c.id === item.categoryId)?.name.toLowerCase() || "";
      return (
        item.name.toLowerCase().includes(query) ||
        item.barcode.toLowerCase().includes(query) ||
        categoryName.includes(query)
      );
    });
  }, [items, searchQuery, categories]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedLocationId) return <div>Please select a location</div>;
  if (!selectedCategoryId) return <div>Please select a category</div>;

  return (
    <SidebarLayout>
      <Toaster 
        position="top-right"
        richColors 
        closeButton
      />
      <Header />
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name, barcode, or category..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <CirclePlus className="h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your inventory
                </DialogDescription>
              </DialogHeader>
              <ItemForm
                locationId={selectedLocationId}
                categoryId={selectedCategoryId}
                onSubmit={async (data) => {
                  return handleAddItem({ ...data });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="regular">Regular Items</TabsTrigger>
            <TabsTrigger value="temporary">Temporary Items</TabsTrigger>
          </TabsList>
          <TabsContent value="regular">
            <ItemTable
              items={filteredItems.filter(item => !item.isTemporary)}
              locationId={selectedLocationId}
              onEdit={(item) => {
                setEditingItem(item);
                setIsEditDialogOpen(true);
              }}
              onDelete={(item) => {
                setEditingItem(item);
                setIsDeleteDialogOpen(true);
              }}
            />
          </TabsContent>
          <TabsContent value="temporary">
            <ItemTable
              items={filteredItems.filter((item) => item.isTemporary)}
              locationId={selectedLocationId}
              onEdit={(item) => {
                setEditingItem(item);
                setIsEditDialogOpen(true);
              }}
              onDelete={(item) => {
                setEditingItem(item);
                setIsDeleteDialogOpen(true);
              }}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Edit the selected item
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <ItemForm
                locationId={selectedLocationId}
                initialData={editingItem}
                onSubmit={handleEditItem}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item?
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
                onClick={() => handleDeleteItem()}
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
