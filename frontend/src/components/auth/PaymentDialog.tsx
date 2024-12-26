// components/auth/PaymentDialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const paymentMethods = {
  telebirr: { number: "+251 94 474 7215", name: "Baslieal Dawit Rago" },
  cbe: { number: "1000523281082", name: "Baslieal Dawit Rago" },
  awash: { number: "01304080597700", name: "Baslieal Dawit Rago" },
};

export function PaymentDialog({
  price,
  children,
}: {
  price: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const pricing = {
    subtotal: price,
    tot: price * 0.15,
    total: price + price * 0.15,
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Account number has been copied to your clipboard",
    });
  };

  const handlePaymentConfirmation = async () => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/auth/payment-success");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Subscription</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method and complete the transaction
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Price Breakdown</Label>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{pricing.subtotal.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>TOT (15%)</span>
                <span>{pricing.tot.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-1">
                <span>Total</span>
                <span>{pricing.total.toLocaleString()} ETB</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reference Number</Label>
            <Input
              placeholder="Enter payment reference number"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Select Payment Method</Label>
            <RadioGroup
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telebirr" id="telebirr" />
                <Label htmlFor="telebirr">TeleBirr</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cbe" id="cbe" />
                <Label htmlFor="cbe">Commercial Bank of Ethiopia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="awash" id="awash" />
                <Label htmlFor="awash">Awash Bank</Label>
              </div>
            </RadioGroup>
          </div>

          {selectedPaymentMethod && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <h4 className="font-medium">Payment Details</h4>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Account Name: {paymentMethods[selectedPaymentMethod].name}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">
                    Account Number:{" "}
                    {paymentMethods[selectedPaymentMethod].number}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() =>
                      copyToClipboard(
                        paymentMethods[selectedPaymentMethod].number
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            disabled={
              !selectedPaymentMethod || !referenceNumber || isSubmitting
            }
            onClick={handlePaymentConfirmation}
          >
            {isSubmitting ? "Processing..." : "Confirm Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}