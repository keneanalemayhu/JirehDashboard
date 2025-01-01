"use client";

import { useState, useEffect } from "react";
import { Store, storeApi } from "@/lib/api/store";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function useOwnerStore() {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadStore();
    }
  }, [user]);

  const loadStore = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await storeApi.getStores();
      if (response.success && response.data.length > 0) {
        // Find the store owned by the current user
        const userStore = response.data.find(store => store.owner === user.id);
        if (userStore) {
          setStore(userStore);
        } else {
          console.warn("No store found for current user");
        }
      }
    } catch (error) {
      console.error("Failed to load store:", error);
      toast.error("Failed to load store information");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    store,
    isLoading,
    loadStore,
  };
}
