import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/dashboard/business/order";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGetInvoice: () => Promise<Order | null>;
  orderId: string | null;
  locationId: number;
}

export function InvoiceDialog({
  open,
  onOpenChange,
  onGetInvoice,
  orderId,
  locationId,
}: InvoiceDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [orderData, setOrderData] = React.useState<Order | null>(null);

  React.useEffect(() => {
    if (open && orderId) {
      handleGetInvoice();
    }
  }, [open, orderId]);

  const handleGetInvoice = async () => {
    setIsLoading(true);
    try {
      const data = await onGetInvoice();
      if (data) {
        setOrderData(data);
      }
    } catch (error) {
      console.error('Failed to get invoice:', error);
      toast.error("Failed to get invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (!orderData) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups and try again.");
      return;
    }

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${orderData.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .customer-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; }
          .total { text-align: right; font-weight: bold; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>Invoice</h1>
          <p>Order #${orderData.id}</p>
        </div>
        
        <div class="customer-details">
          <h2>Customer Details</h2>
          <p>Name: ${orderData.customer_name || 'N/A'}</p>
          <p>Phone: ${orderData.customer_phone || 'N/A'}</p>
          <p>Email: ${orderData.customer_email || 'N/A'}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${orderData.items.map(item => `
              <tr>
                <td>${item.item_name || 'N/A'}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.unit_price)}</td>
                <td>${formatCurrency(item.quantity * item.unit_price)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="total">Total Amount:</td>
              <td>${formatCurrency(orderData.total_amount)}</td>
            </tr>
          </tfoot>
        </table>

        <div>
          <p>Status: ${orderData.status}</p>
          <p>Payment Status: ${orderData.payment_status}</p>
          <p>Created At: ${new Date(orderData.created_at).toLocaleString()}</p>
        </div>

        <button class="no-print" onclick="window.print()">Print Invoice</button>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice #{orderId}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orderData ? (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Details</h3>
                    <p className="text-sm">Name: {orderData.customer_name || 'N/A'}</p>
                    <p className="text-sm">Phone: {orderData.customer_phone || 'N/A'}</p>
                    <p className="text-sm">Email: {orderData.customer_email || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Order Status</h3>
                    <p className="text-sm">Status: {orderData.status}</p>
                    <p className="text-sm">Payment: {orderData.payment_status}</p>
                    <p className="text-sm">Date: {new Date(orderData.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold">{formatCurrency(orderData.total_amount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Order Items</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.item_name || 'N/A'}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.quantity * item.unit_price)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Failed to load invoice</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handlePrint} disabled={!orderData || isLoading}>
            Print Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
