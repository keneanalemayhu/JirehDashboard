/**
 * Core entity interfaces
 */
export interface Item {
  id: string;
  name: string;
  barcode: string;
  price: string;
  quantity: number;
  categoryId: number;
  isActive: boolean;
  isHidden: boolean;
  isTemporary: boolean;
  expiryHours: number | null;
  autoResetQuantity: boolean;
  lastQuantityReset: Date | null;
  lastInventoryUpdate: Date;
}

/**
 * Form-related types
 */
export type ItemFormData = Omit<
  Item,
  "id" | "lastInventoryUpdate" | "lastQuantityReset"
>;

/**
 * Table-related types
 */
export interface ItemTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export interface ItemTableRowProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  temporaryStatus?: string;
}
