export interface Category {
  id: string;
  name: string;
  description: string;
  location: string;
  isHidden: boolean;
}

export const initialCategories: Category[] = [
  {
    id: "CAT-001",
    name: "Electronics",
    description: "Electronic devices and accessories",
    location: "Warehouse A",
    isHidden: false,
  },
  {
    id: "CAT-002",
    name: "Furniture",
    description: "Home and office furniture",
    location: "Warehouse B",
    isHidden: false,
  },
  {
    id: "CAT-003",
    name: "Books",
    description: "Books and publications",
    location: "Store Front",
    isHidden: true,
  },
  {
    id: "CAT-004",
    name: "Clothing",
    description: "Apparel and accessories",
    location: "Store Front",
    isHidden: false,
  },
];

export const locations = [
  "Warehouse A",
  "Warehouse B",
  "Store Front",
  "Online",
];

export type SortDirection = "asc" | "desc" | null;
