import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderItem } from "@/types/dashboard/business/order";

interface CategoryAccordionProps {
  categories: {
    name: string;
    items: OrderItem[];
  }[];
  addToCart: (item: OrderItem, quantity: number) => void;
  isLoading?: boolean;
}

export function CategoryAccordion({
  categories,
  addToCart,
  isLoading = false,
}: CategoryAccordionProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value, 10) || 0;
    setQuantities((prev) => ({ ...prev, [itemId]: quantity }));
  };

  const handleAddToCart = (item: OrderItem) => {
    const quantity = quantities[item.item_id] || 0;
    if (quantity > 0) {
      addToCart(item, quantity);
      setQuantities((prev) => ({ ...prev, [item.item_id]: 0 }));
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {categories.map((category, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-lg font-medium">
            {category.name}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-4">
              {category.items.map((item) => (
                <li
                  key={item.item_id}
                  className="flex items-center justify-between bg-muted p-3 rounded-md"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.unit_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(
                          item.item_id,
                          String(Math.max(0, (quantities[item.quantity] || 0) - 1))
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={quantities[item.item_id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(item.item_id, e.target.value)
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(
                          item.item_id,
                          String((quantities[item.item_id] || 0) + 1)
                        )
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleAddToCart(item)}>Add</Button>
                  </div>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
