"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/sales/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/sales/Sidebar";
import { OrderTable } from "@/components/dashboard/business/sales/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/sales/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/sales/orders/OrderTablePagination";
import { useOrders } from "@/hooks/dashboard/business/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/types/dashboard/business/order";

export default function OrdersPage() {
  const {
    orders,
    filterValue,
    setFilterValue,
    handleUpdatePaymentStatus,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    selectedOrder,
    setSelectedOrder,
    handleSort,
    filteredOrders,
    paginatedOrders,
    statusFilter,
    handleStatusFilterChange,
    pageSize,
    currentPage,
    handlePageChange,
    handlePageSizeChange,
  } = useOrders();

  // Calculate totals
  const totalOrders = filteredOrders?.length || 0;
  const totalAmount =
    filteredOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
  const paidOrders =
    filteredOrders?.filter((order) => order.payment_status === "paid").length ||
    0;
  const pendingOrders =
    filteredOrders?.filter((order) => order.payment_status === "pending")
      .length || 0;

  // Export orders
  const handleExport = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Items",
      "Total Amount",
      "Payment Status",
      "Order Status",
      "Employee",
      "Location",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredOrders.map((order) =>
        [
          order.id,
          new Date(order.order_date).toLocaleString(),
          `"${order.customer_name}"`,
          order.items_count,
          order.total_amount,
          `"${order.payment_status}"`,
          `"${order.status}"`,
          `"${order.employee_name}"`,
          `"${order.location_name}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `orders-export-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header with Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Orders Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Track and manage your sales orders
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleExport}
              title="Export Orders"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </div>
                <div className="text-2xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </div>
                <div className="text-2xl font-bold">
                  ETB {totalAmount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Paid Orders
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {paidOrders}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingOrders}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <Input
                placeholder="Search orders..."
                className="max-w-sm"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <OrderTableSettings
                showCurrency={true}
                onShowCurrencyChange={() => {}}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
              />
            </div>
          </div>

          {/* Table */}
          <OrderTable
            orders={paginatedOrders}
            onSort={handleSort}
            onStatusUpdate={handleUpdatePaymentStatus}
            isDetailsDialogOpen={isDetailsDialogOpen}
            setIsDetailsDialogOpen={setIsDetailsDialogOpen}
            selectedOrder={selectedOrder}
          />

          {/* Pagination */}
          <OrderTablePagination
            totalItems={totalOrders}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
