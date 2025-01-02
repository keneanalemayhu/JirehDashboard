"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Item,
  ItemFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/item";
import { itemApi } from "@/lib/api/item";
import { toast } from "sonner";

export function useItems(categoryId: number) {
  // Basic state
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<"regular" | "temporary">("regular");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Table states
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>({
    id: true,
    categoryId: true,
    name: true,
    price: true,
    barcode: true,
    quantity: true,
    lastInventoryUpdate: true,
    lastQuantityReset: true,
    isActive: true,
    isHidden: true,
    isTemporary: true,
    expiryHours: true,
    autoResetQuantity: true,
    temporaryStatus: true,
  });

  // Fetch items when categoryId changes
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await itemApi.getItems(categoryId);
        setItems(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error fetching items');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchItems();
    }
  }, [categoryId]);

  // Handlers
  const handleAddItem = async (data: ItemFormData) => {
    try {
      const newItem = await itemApi.createItem(categoryId, data);
      // Use useEffect to handle state updates after successful creation
      const updatedItems = await itemApi.getItems(categoryId);
      setItems(updatedItems);
      setIsAddDialogOpen(false);
      setError(null);
      toast.success('Item created successfully');
      return newItem;
    } catch (err: any) {
      console.error('Error creating item:', err);
      setError(err.message || 'Error creating item');
      throw err;
    }
  };

  const handleEditItem = async (data: ItemFormData) => {
    if (!editingItem) return;
    try {
      await itemApi.updateItem(categoryId, editingItem.id, data);
      // Use useEffect to handle state updates after successful edit
      const updatedItems = await itemApi.getItems(categoryId);
      setItems(updatedItems);
      setIsEditDialogOpen(false);
      setEditingItem(null);
      toast.success('Item updated successfully');
    } catch (err: any) {
      console.error('Error updating item:', err);
      setError(err.message || 'Error updating item');
      throw err;
    }
  };

  const handleDeleteItem = async () => {
    if (!editingItem) return;
    try {
      await itemApi.deleteItem(categoryId, editingItem.id);
      // Use useEffect to handle state updates after successful deletion
      const updatedItems = await itemApi.getItems(categoryId);
      setItems(updatedItems);
      setIsDeleteDialogOpen(false);
      setEditingItem(null);
      toast.success('Item deleted successfully');
    } catch (err: any) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Error deleting item');
      toast.error('Failed to delete item');
    }
  };

  // Add effect to handle dialog state and success messages
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (items) {
      timeoutId = setTimeout(() => {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        setIsDeleteDialogOpen(false);
        setEditingItem(null);
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [items]);

  const handleTabChange = (tab: "regular" | "temporary") => {
    setActiveTab(tab);
  };
  // Add these new functions
  const getItemById = useCallback((itemId: string | number) => {
    return items.find(item => item.id.toString() === itemId.toString());
  }, [items]);

  const checkItemAvailability = useCallback((itemId: string | number, quantity: number) => {
    const item = getItemById(itemId);
    if (!item) return false;
    return item.quantity >= quantity && item.isActive;
  }, [getItemById]);


  return {
    // Data
    items: items.filter(item => activeTab === "regular" ? !item.isTemporary : item.isTemporary),
    loading,
    error,
    editingItem,
    activeTab,

    // State setters
    setEditingItem,
    setActiveTab,
    columnsVisible,
    setColumnsVisible,

    // Dialog states
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,

    // Handlers
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleTabChange,

    //helper functions
    getItemById,
    checkItemAvailability,
    categoryId,
    isLoading: loading,
  };
}
