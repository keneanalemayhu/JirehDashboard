import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderFormProps {
  onSubmit: (buyerDetails: {
    name: string;
    phone: string;
    email: string;
  }) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [buyerDetails, setBuyerDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(buyerDetails);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Buyer Name</Label>
        <Input
          id="name"
          name="name"
          value={buyerDetails.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={buyerDetails.phone}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={buyerDetails.email}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Order
      </Button>
    </form>
  );
}
