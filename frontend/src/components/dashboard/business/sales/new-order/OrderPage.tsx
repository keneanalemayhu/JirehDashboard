import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Item, OrderItem } from "@/types/dashboard/business/new-order";
import { CategoryAccordion } from "./CategoryAccordion";
import { OrderForm } from "./OrderForm";
import { CartSummary } from "./CartSummary";
import { QRCodeDialog } from "./QRCodeDialog";

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
    <div className="mx-auto max-w-5xl p-4">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">New Order</h1>
      </div>
      <Separator className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:max-w-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Items Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <CategoryAccordion
                categories={categories}
                addToCart={addToCart}
              />
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="md:max-w-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <CartSummary
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            </CardContent>
          </Card>

          <Card className="md:max-w-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Buyer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderForm onSubmit={handleSubmitOrder} />
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit this order?
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

      <QRCodeDialog
        open={isQRCodeDialogOpen}
        onOpenChange={setIsQRCodeDialogOpen}
        onGetInvoice={() => {
          console.log("Downloading invoice...");
        }}
      />

      <Toaster />
    </div>
  );
}
