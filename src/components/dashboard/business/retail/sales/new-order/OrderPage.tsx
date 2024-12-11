"use client";

import { useState } from "react";
import { CategoryAccordion } from "./CategoryAccordion";
import { OrderForm } from "./OrderForm";
import { CartSummary } from "./CartSummary";
import { Item, OrderItem } from "@/types/dashboard/business/retail/sales/new-order";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QRCodeDialog } from "./QRCodeDialog"; // Updated import statement

const categories = [
  {
    name: "Electronics",
    items: [
      { id: "e1", name: "Smartphone", price: 699 },
      { id: "e2", name: "Laptop", price: 999 },
      { id: "e3", name: "Tablet", price: 399 },
    ],
  },
  {
    name: "Clothing",
    items: [
      { id: "c1", name: "T-Shirt", price: 19.99 },
      { id: "c2", name: "Jeans", price: 49.99 },
      { id: "c3", name: "Jacket", price: 89.99 },
    ],
  },
  {
    name: "Books",
    items: [
      { id: "b1", name: "Fiction Novel", price: 14.99 },
      { id: "b2", name: "Cookbook", price: 24.99 },
      { id: "b3", name: "Biography", price: 19.99 },
    ],
  },
];

export default function OrderPage() {
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    buyerDetails: { name: string; phone: string; email: string };
  } | null>(null);
  const { toast } = useToast();
  const [isQRCodeDialogOpen, setIsQRCodeDialogOpen] = useState(false);

  const addToCart = (item: Item, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleSubmitOrder = (buyerDetails: {
    name: string;
    phone: string;
    email: string;
  }) => {
    setPendingOrder({ buyerDetails });
    setIsDialogOpen(true);
  };

  const confirmOrder = () => {
    if (pendingOrder) {
      console.log("Order submitted:", { ...pendingOrder, items: cart });
      toast({
        title: "Order Submitted",
        description: `Order for ${pendingOrder.buyerDetails.name} has been placed successfully.`,
      });
      setIsQRCodeDialogOpen(true);
      setCart([]);
      setPendingOrder(null);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">New Order</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Items Catalog</h2>
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <CategoryAccordion categories={categories} addToCart={addToCart} />
          </div>
        </div>
        <div>
          <div className="bg-card rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <CartSummary
              cart={cart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          </div>
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Buyer Information</h2>
            <OrderForm onSubmit={handleSubmitOrder} />
          </div>
        </div>
      </div>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmOrder}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
      <QRCodeDialog
        open={isQRCodeDialogOpen}
        onOpenChange={setIsQRCodeDialogOpen}
        onGetInvoice={() => {
          // Placeholder for invoice download functionality
          console.log("Downloading invoice...");
        }}
      />
    </div>
  );
}
