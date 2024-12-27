export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem extends Item {
  quantity: number;
}
