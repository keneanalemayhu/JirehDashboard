//orderPage
import { useCallback, useMemo, useState } from "react";
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
import { OrderItem } from "@/types/dashboard/business/order";
import { CategoryAccordion } from "./CategoryAccordion";
import { OrderForm } from "./OrderForm";
import { CartSummary } from "./CartSummary";
import { InvoiceDialog } from "./QRCodeDialog";
import { useOrder } from "@/hooks/dashboard/business/order";
import { useItems } from "@/hooks/dashboard/business/item";
import { useCategories } from "@/hooks/dashboard/business/category";
import { Item } from "@/types/dashboard/business/item";
import { Toast } from "@radix-ui/react-toast";
import { useLocation } from "@/hooks/LocationContext";

export default function OwnerPage() {
  const { locationId } = useLocation();
  const { toast } = useToast();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    buyerDetails: { name: string; phone: string; email: string };
  } | null>(null);
 
  const { 
    isLoading: orderLoading, 
    isQRCodeDialogOpen, 
    setIsQRCodeDialogOpen,
    currentOrderId,
    createOrder,
    getInvoice 
  } = useOrder(locationId);
 
  const { categories, loading: categoriesLoading } = useCategories(locationId);
  const { items, loading: itemsLoading, checkItemAvailability } = useItems(locationId);
 
  const organizedCategories = useMemo(() => {
    if (!categories?.length || !items?.length) return [];
    
    return categories.map(category => ({
      id: category.id,
      name: category.name,
      items: items
        .filter(item => item.categoryId === category.id)
        .map(item => ({
          item_id: item.id.toString(),
          name: item.name,
          unit_price: Number(item.price),
          quantity: item.quantity
        }))
    }));
  }, [categories, items]);
 
  const addToCart = useCallback((item: OrderItem, quantity: number) => {
    if (!checkItemAvailability(item.item_id, quantity)) {
      toast({ 
        description: "Item not available in requested quantity",
        variant: "destructive" 
      });
      return;
    }
 
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item_id === item.item_id);
      if (existingItem) {
        if (!checkItemAvailability(item.item_id, existingItem.quantity + quantity)) {
          toast({ description: "Cannot add more of this item", variant: "destructive" });
          return prevCart;
        }
        return prevCart.map(cartItem =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  }, [checkItemAvailability, toast]);
 
  const removeFromCart = useCallback((itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.item_id !== itemId));
  }, []);
 
  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.item_id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);
 
  const handleSubmitOrder = useCallback((buyerDetails: {
    name: string;
    phone: string;
    email: string;
  }) => {
    setPendingOrder({ buyerDetails });
    setIsDialogOpen(true);
  }, []);
 
  const confirmOrder = useCallback(async () => {
    if (!pendingOrder) return;
 
    try {
      const orderData = {
        location: locationId,
        customer_name: pendingOrder.buyerDetails.name,
        customer_phone: pendingOrder.buyerDetails.phone,
        customer_email: pendingOrder.buyerDetails.email,
        items: cart.map(item => ({
          item_id: item.item_id,
          name: item.item_name,
          quantity: item.quantity,
          unit_price: item.unit_price
        }))
      };
 
      await createOrder(orderData);
      setCart([]);
      setPendingOrder(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create order:', error);
      toast({ 
        description: "Failed to create order", 
        variant: "destructive" 
      });
    }
  }, [pendingOrder, locationId, cart, createOrder, toast]);

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
                categories={organizedCategories}
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

     <InvoiceDialog
        open={isQRCodeDialogOpen}
        onOpenChange={setIsQRCodeDialogOpen}
        onGetInvoice={getInvoice}
        orderId={currentOrderId}
        locationId={locationId}
      />

      <Toaster />
    </div>
  );
}
