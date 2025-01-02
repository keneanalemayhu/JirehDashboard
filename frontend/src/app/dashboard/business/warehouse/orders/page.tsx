"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/warehouse/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/warehouse/Sidebar";
import { OrderTable } from "@/components/dashboard/business/warehouse/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/warehouse/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/warehouse/orders/OrderTablePagination";
import { useOrders } from "@/hooks/dashboard/business/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Order, PaymentStatus, PaymentStatuses, OrderFilters, OrderStatus } from "@/types/dashboard/business/order";
import { useLocations } from "@/hooks/dashboard/business/location";

export default function OrdersPage() {
  const { locations } = useLocations();
  const selectedLocation = locations[0]; // Assuming the first location is selected
  const locationId = selectedLocation?.id || 0;

  const [showAmounts, setShowAmounts] = React.useState(true);
  const [showEmployeeInfo, setShowEmployeeInfo] = React.useState(true);
  const [showCustomerInfo, setShowCustomerInfo] = React.useState(true);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const {
    orders,
    isLoading,
    error,
    filters,
    setFilters,
    selectedOrder,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    updateOrder,
    handleSort,
    sortColumn,
    refresh
  } = useOrders(locationId);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const completed = orders.filter(order => order.status === 'completed').length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    
    return {
      totalAmount: total,
      totalOrders: orders.length,
      paidOrders: completed,
      pendingOrders: pending,
      cancelledOrders: cancelled
    };
  }, [orders]);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: searchTerm.toLowerCase()
    }));
  };

  const handleStatusFilterChange = (status: PaymentStatus) => {
    setFilters(prev => ({ 
      ...prev, 
      paymentStatus: status 
    }));
  };

  const handleUpdatePaymentStatus = async (orderId: string, status: PaymentStatus) => {
    await updateOrder(orderId, { payment_status: status });
    refresh();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrder(orderId, { status });
    refresh();
  };

  // Export orders
  const handleExport = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer",
      "Total Amount",
      "Payment Status",
      "Order Status",
      "Employee",
      "Location",
    ];

    const csvContent = [
      headers.join(","),
      ...orders.map((order) =>
        [
          order.id,
          new Date(order.created_at).toLocaleString(),
          `"${order.customer_name || 'N/A'}"`,
          order.total_amount,
          `"${order.payment_status}"`,
          `"${order.status}"`,
          `"${order.employee_name || 'N/A'}"`,
          `"${selectedLocation?.name || 'N/A'}"`,
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

  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        return (
          order.id.toString().includes(searchTerm) ||
          order.customer_name?.toLowerCase().includes(searchTerm) ||
          order.customer_phone?.toLowerCase().includes(searchTerm) ||
          order.customer_email?.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  }, [orders, filters.searchTerm]);

  if (!locationId) {
    return (
      <SidebarLayout>
        <Header />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
              <p className="text-sm text-muted-foreground">Please select a location to view orders</p>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

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
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </div>
                <div className="text-2xl font-bold">
                  ETB {stats.totalAmount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Completed Orders
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.paidOrders}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Pending Orders
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingOrders}
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
                value={filters.searchTerm || ""}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <OrderTableSettings
                showCurrency={showAmounts}
                onShowCurrencyChange={setShowAmounts}
                statusFilter={filters.paymentStatus === 'all' ? [] : [filters.paymentStatus as PaymentStatus]}
                onStatusFilterChange={handleStatusFilterChange}
              />
            </div>
          </div>

          {/* Table */}
          <OrderTable
            orders={filteredOrders}
            onSort={handleSort}
            onStatusUpdate={handleUpdateOrderStatus}
            selectedOrder={selectedOrder}
          />

          {/* Pagination */}
          <OrderTablePagination
            totalItems={filteredOrders.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
