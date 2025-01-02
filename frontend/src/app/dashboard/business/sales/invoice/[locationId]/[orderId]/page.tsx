import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { orderApi } from '@/lib/api/order';
import { formatCurrency } from '@/lib/utils';

interface InvoicePageProps {
  params: {
    locationId: string;
    orderId: string;
  };
}

async function getOrderDetails(locationId: string, orderId: string) {
  try {
    return await orderApi.getOrderDetails(Number(locationId), orderId);
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    return null;
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const order = await getOrderDetails(params.locationId, params.orderId);

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-semibold text-red-600">Order not found</h1>
            <p className="text-gray-600">The requested order could not be found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-gray-600">Order #{order.id}</p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Customer Details</h2>
            <div className="text-sm text-gray-600">
              <p>Name: {order.customer_name}</p>
              <p>Phone: {order.customer_phone}</p>
              <p>Email: {order.customer_email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Order Items</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Item</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Qty</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{item.item_name}</td>
                      <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.quantity * item.unit_price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-semibold">Total Amount:</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatCurrency(order.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Order Status</h2>
            <div className="text-sm text-gray-600">
              <p>Status: {order.status}</p>
              <p>Payment Status: {order.payment_status}</p>
              <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
