// src/types/category.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  location: string;
  isHidden: boolean;
}

export type SortDirection = "asc" | "desc" | null;

export const locations = ["Location 1", "Location 2", "Location 3"];
