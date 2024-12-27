"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import { OrderTable } from "@/components/dashboard/business/owner/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/owner/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/owner/orders/OrderTablePagination";
import { useOrders, initialOrders } from "@/hooks/dashboard/business/order";
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
import { PaymentStatus, OrderFilters } from "@/types/dashboard/business/order";

export default function OrdersPage() {
  const [timeframe, setTimeframe] = React.useState("today");
  const [showAmounts, setShowAmounts] = React.useState(true);
  const [showEmployeeInfo, setShowEmployeeInfo] = React.useState(true);
  const [showCustomerInfo, setShowCustomerInfo] = React.useState(true);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const {
    orders,
    filters,
    setFilters,
    selectedOrder,
    paginatedOrders,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    updateOrder,
    handleSort,
    sortColumn,
  } = useOrders(initialOrders);

  // Function to get filtered orders based on timeframe
  const getTimeframeOrders = React.useCallback(() => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    let startDate;
    switch (timeframe) {
      case "today":
        startDate = startOfDay;
        break;
      case "week":
        startDate = startOfWeek;
        break;
      case "month":
        startDate = startOfMonth;
        break;
      case "year":
        startDate = startOfYear;
        break;
      default:
        return orders;
    }

    return orders.filter((order) => new Date(order.order_date) >= startDate);
  }, [timeframe, orders]);

  const timeframeOrders = React.useMemo(
    () => getTimeframeOrders(),
    [getTimeframeOrders]
  );

  // Calculate statistics based on timeframe orders
  const stats = React.useMemo(
    () => ({
      totalOrders: timeframeOrders.length,
      totalAmount: timeframeOrders.reduce(
        (sum, order) => sum + order.total_amount,
        0
      ),
      paidOrders: timeframeOrders.filter(
        (order) => order.payment_status === PaymentStatus.PAID
      ).length,
      pendingOrders: timeframeOrders.filter(
        (order) => order.payment_status === PaymentStatus.PENDING
      ).length,
      cancelledOrders: timeframeOrders.filter(
        (order) => order.payment_status === PaymentStatus.CANCELLED
      ).length,
    }),
    [timeframeOrders]
  );

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    setPage(1);
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, searchTerm });
  };

  // Handle status filter change
  const handleStatusFilterChange = (statuses: PaymentStatus[]) => {
    setFilters({ ...filters, paymentStatus: statuses });
  };

  // Handle payment status update
  const handleUpdatePaymentStatus = async (
    orderId: string,
    newStatus: PaymentStatus
  ) => {
    await updateOrder(orderId, { payment_status: newStatus });
  };

  // Export functions
  const handleExport = (format: "csv" | "excel" | "sheets") => {
    const headers = [
      "Order ID",
      "Order Number",
      ...(showCustomerInfo
        ? ["Customer Name", "Customer Phone", "Customer Email"]
        : []),
      ...(showEmployeeInfo ? ["Employee Name"] : []),
      "Status",
      "Payment Status",
      ...(showAmounts ? ["Total Amount"] : []),
      "Order Date",
    ];

    const rows = timeframeOrders.map((order) => {
      const row = [order.order_id, order.order_number];

      if (showCustomerInfo) {
        row.push(
          order.customer.name,
          order.customer.phone,
          order.customer.email
        );
      }

      if (showEmployeeInfo) {
        row.push(order.employee_name);
      }

      row.push(order.status, order.payment_status);

      if (showAmounts) {
        row.push(order.total_amount.toString());
      }

      row.push(new Date(order.order_date).toLocaleString());

      return row;
    });

    const content = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([content], {
      type:
        format === "csv"
          ? "text/csv;charset=utf-8;"
          : "application/vnd.ms-excel;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-export-${timeframe}-${
      new Date().toISOString().split("T")[0]
    }.${format === "csv" ? "csv" : format === "excel" ? "xls" : "tsv"}`;
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
                {timeframe === "today"
                  ? "Today's"
                  : timeframe === "week"
                  ? "This Week's"
                  : timeframe === "month"
                  ? "This Month's"
                  : timeframe === "year"
                  ? "This Year's"
                  : "Total"}{" "}
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
                defaultValue="today"
                value={timeframe}
                onValueChange={handleTimeframeChange}
              >
                <TabsList>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">This Week</TabsTrigger>
                  <TabsTrigger value="month">This Month</TabsTrigger>
                  <TabsTrigger value="year">This Year</TabsTrigger>
                  <TabsTrigger value="total">Total</TabsTrigger>
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
                settings={{
                  showAmounts,
                  showEmployeeInfo,
                  showCustomerInfo,
                  statusFilter: filters.paymentStatus || [],
                  sortDirection,
                  itemsPerPage,
                }}
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
            orders={paginatedOrders}
            settings={{
              showAmounts,
              showEmployeeInfo,
              showCustomerInfo,
              sortDirection,
              itemsPerPage,
              statusFilter: filters.paymentStatus || [],
            }}
            onSort={handleSort}
            onStatusUpdate={handleUpdatePaymentStatus}
            selectedOrder={selectedOrder}
          />

          {/* Pagination */}
          <OrderTablePagination
            totalItems={timeframeOrders.length}
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
