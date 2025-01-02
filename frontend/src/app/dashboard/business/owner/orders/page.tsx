"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { OrderTable } from "@/components/dashboard/business/owner/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/owner/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/owner/orders/OrderTablePagination";
import { useOrders } from "@/hooks/dashboard/business/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileDown, FileSpreadsheet, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Order, PaymentStatus, PaymentStatuses, OrderFilters } from "@/types/dashboard/business/order";
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

  const handleTimeframeChange = (timeframe: string) => {
    setFilters(prev => ({ 
      ...prev, 
      timeframe: timeframe as OrderFilters['timeframe']
    }));
  };

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

  const handleExport = (format: "csv" | "excel" | "sheets") => {
    const headers = [
      "Order ID",
      ...(showCustomerInfo ? ["Customer Name", "Customer Phone", "Customer Email"] : []),
      ...(showEmployeeInfo ? ["Employee Name"] : []),
      "Status",
      "Payment Status",
      ...(showAmounts ? ["Total Amount"] : []),
      "Order Date",
    ];

    const rows = orders.map((order) => {
      const row = [order.id];

      if (showCustomerInfo) {
        row.push(
          order.customer_name || 'N/A',
          order.customer_phone || 'N/A',
          order.customer_email || 'N/A'
        );
      }

      // if (showEmployeeInfo) {
      //   row.push(order.employee_name || 'N/A');
      // }

      row.push(order.status, order.payment_status);

      if (showAmounts) {
        row.push(order.total_amount.toString());
      }

      row.push(new Date(order.created_at).toLocaleString());

      return row;
    });

    const content = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([content], {
      type: format === "csv" ? "text/csv;charset=utf-8;" : "application/vnd.ms-excel;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-export-${filters.timeframe}-${new Date().toISOString().split("T")[0]}.${
      format === "csv" ? "csv" : format === "excel" ? "xls" : "tsv"
    }`;
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

  const settings = {
    showAmounts,
    showEmployeeInfo,
    showCustomerInfo,
    statusFilter: filters.paymentStatus === 'all' ? [] : [filters.paymentStatus],
    sortDirection,
    itemsPerPage,
  };

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
                {filters.timeframe === "today"
                  ? "Today's"
                  : filters.timeframe === "this_week"
                  ? "This Week's"
                  : filters.timeframe === "this_month"
                  ? "This Month's"
                  : "All"}{" "}
                Orders Overview ({stats.totalOrders}{" "}
                {stats.totalOrders === 1 ? "order" : "orders"})
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => handleExport("sheets")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export for Google Sheets</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("excel")}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>Export as CSV</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Time Navigation */}
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <Tabs
                defaultValue="all"
                value={filters.timeframe}
                onValueChange={handleTimeframeChange}
              >
                <TabsList>
                  <TabsTrigger value="all">All Time</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="this_week">This Week</TabsTrigger>
                  <TabsTrigger value="this_month">This Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                  Paid Orders
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
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Cancelled Orders
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.cancelledOrders}
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
                settings={settings}
                onSettingsChange={{
                  onShowAmountsChange: setShowAmounts,
                  onShowEmployeeInfoChange: setShowEmployeeInfo,
                  onShowCustomerInfoChange: setShowCustomerInfo,
                  onStatusFilterChange: handleStatusFilterChange,
                  onSortDirectionChange: setSortDirection,
                  onItemsPerPageChange: setItemsPerPage,
                }}
              />
            </div>
          </div>

          {/* Table */}
          <OrderTable
            orders={filteredOrders}
            settings={settings}
            onSort={handleSort}
            onStatusUpdate={handleUpdatePaymentStatus}
            selectedOrder={selectedOrder}
          />

          {/* Pagination */}
          <OrderTablePagination
            currentPage={currentPage}
            totalItems={Math.ceil(filteredOrders.length / pageSize)}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
