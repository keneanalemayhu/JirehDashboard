import { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/types/dashboard/business/category';
import { categoryApi } from '@/lib/api/category';
import { useLocations } from './location';

export const useCategories = (locationId: number) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryApi.getCategories(locationId);
      setCategories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error fetching categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchCategories();
    }
  }, [locationId]);

  const handleAddCategory = async (data: CategoryFormData) => {
    try {
      await categoryApi.createCategory(locationId, data);
      await fetchCategories();
      setIsAddDialogOpen(false);
    } catch (err: any) {
      setError(err.message || 'Error creating category');
    }
  };

  const handleEditCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    try {
      await categoryApi.updateCategory(locationId, editingCategory.id, data);
      await fetchCategories();
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err.message || 'Error updating category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!editingCategory) return;
    try {
      await categoryApi.deleteCategory(locationId, editingCategory.id);
      await fetchCategories();
      setIsDeleteDialogOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      setError(err.message || 'Error deleting category');
    }
  };

  return {
    categories,
    loading,
    error,
    editingCategory,
    setEditingCategory,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleAddCategory,
    handleEditCategory,
    handleDeleteCategory,
  };
};
