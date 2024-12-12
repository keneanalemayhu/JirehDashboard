import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetInvoice: () => void;
}

export function QRCodeDialog({
  open,
  onOpenChange,
  onGetInvoice,
}: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center h-64 bg-muted">
          {/* Placeholder for QR Code */}
          <span className="text-muted-foreground">QR Code Placeholder</span>
        </div>
        <DialogFooter>
          <Button onClick={onGetInvoice}>Get Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
