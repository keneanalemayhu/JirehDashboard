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
import { Item } from "@/types/order";

interface CategoryAccordionProps {
  categories: {
    name: string;
    items: Item[];
  }[];
  addToCart: (item: Item, quantity: number) => void;
}

export function CategoryAccordion({
  categories,
  addToCart,
}: CategoryAccordionProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value, 10) || 0;
    setQuantities((prev) => ({ ...prev, [itemId]: quantity }));
  };

  const handleAddToCart = (item: Item) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      addToCart(item, quantity);
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
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
                  key={item.id}
                  className="flex items-center justify-between bg-muted p-3 rounded-md"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          String(Math.max(0, (quantities[item.id] || 0) - 1))
                        )
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={quantities[item.id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-16 text-center"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          String((quantities[item.id] || 0) + 1)
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
