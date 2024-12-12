"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/admin/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/admin/Sidebar";
import { OrderTable } from "@/components/dashboard/business/retail/admin/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/retail/admin/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/retail/admin/orders/OrderTablePagination";
import { useOrders } from "@/hooks/dashboard/business/retail/admin/order";
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
import { PaymentStatus } from "@/types/dashboard/business/retail/admin/order";

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
    filterValue,
    setFilterValue,
    handleUpdatePaymentStatus,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    selectedOrder,
    handleSort,
    filteredOrders,
    paginatedOrders,
    statusFilter,
    handleStatusFilterChange,
    pageSize,
    currentPage,
    handlePageChange,
    handlePageSizeChange,
    getFilteredOrdersByTimeframe,
  } = useOrders();

  // Calculate statistics for each timeframe
  const timeframeStats = React.useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const calculateStats = (orders: any[]) => ({
      count: orders.length,
      totalAmount: orders.reduce((sum, order) => sum + order.total_amount, 0),
      paidCount: orders.filter(
        (order) => order.payment_status === PaymentStatus.PAID
      ).length,
      pendingCount: orders.filter(
        (order) => order.payment_status === PaymentStatus.PENDING
      ).length,
      cancelledCount: orders.filter(
        (order) => order.payment_status === PaymentStatus.CANCELLED
      ).length,
    });

    return {
      today: calculateStats(
        orders.filter((order) => new Date(order.created_at) >= startOfDay)
      ),
      week: calculateStats(
        orders.filter((order) => new Date(order.created_at) >= startOfWeek)
      ),
      month: calculateStats(
        orders.filter((order) => new Date(order.created_at) >= startOfMonth)
      ),
      year: calculateStats(
        orders.filter((order) => new Date(order.created_at) >= startOfYear)
      ),
      total: calculateStats(orders),
    };
  }, [orders]);

  // Get filtered orders based on timeframe
  const timeframeOrders = React.useMemo(() => {
    return getFilteredOrdersByTimeframe(timeframe);
  }, [timeframe, getFilteredOrdersByTimeframe]);

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
    handlePageChange(1); // Use handlePageChange from useOrders instead of setCurrentPage
  };

  // Enhanced settings options
  const tableSettings = {
    showAmounts,
    showEmployeeInfo,
    showCustomerInfo,
    sortDirection,
    itemsPerPage,
    statusFilter,
  };

  // Export handlers...
  const handleCSVExport = () => {
    const headers = [
      "Order ID",
      "Item",
      "Quantity",
      "Unit Price",
      "Subtotal",
      ...(showEmployeeInfo ? ["Employee"] : []),
      ...(showCustomerInfo ? ["Customer"] : []),
      ...(showAmounts ? ["Total Amount"] : []),
      "Payment Status",
      "Created At",
    ];

    const csvContent = [
      headers.join(","),
      ...timeframeOrders.map((order) => {
        const row = [
          order.order_id,
          `"${order.item_name}"`,
          order.quantity,
          order.unit_price,
          order.subtotal,
        ];

        if (showEmployeeInfo) row.push(`"${order.employee_name}"`);
        if (showCustomerInfo) row.push(`"${order.user_name}"`);
        if (showAmounts) row.push(order.total_amount.toString());

        row.push(
          `"${order.payment_status}"`,
          new Date(order.created_at).toLocaleString()
        );

        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-export-${timeframe}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExcelExport = () => {
    const headers = [
      "Order ID",
      "Item",
      "Quantity",
      "Unit Price",
      "Subtotal",
      ...(showEmployeeInfo ? ["Employee"] : []),
      ...(showCustomerInfo ? ["Customer"] : []),
      ...(showAmounts ? ["Total Amount"] : []),
      "Payment Status",
      "Created At",
    ];

    const excelContent = [
      headers,
      ...timeframeOrders.map((order) => {
        const row = [
          order.order_id,
          order.item_name,
          order.quantity,
          order.unit_price,
          order.subtotal,
        ];

        if (showEmployeeInfo) row.push(order.employee_name);
        if (showCustomerInfo) row.push(order.user_name);
        if (showAmounts) row.push(order.total_amount);

        row.push(
          order.payment_status,
          new Date(order.created_at).toLocaleString()
        );

        return row;
      }),
    ]
      .map((row) => row.join("\t"))
      .join("\n");

    const blob = new Blob([excelContent], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-export-${timeframe}-${
      new Date().toISOString().split("T")[0]
    }.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoogleSheetsExport = () => {
    const headers = [
      "Order ID",
      "Item",
      "Quantity",
      "Unit Price",
      "Subtotal",
      ...(showEmployeeInfo ? ["Employee"] : []),
      ...(showCustomerInfo ? ["Customer"] : []),
      ...(showAmounts ? ["Total Amount"] : []),
      "Payment Status",
      "Created At",
    ];

    const sheetContent = [
      headers,
      ...timeframeOrders.map((order) => {
        const row = [
          order.order_id,
          order.item_name,
          order.quantity,
          order.unit_price,
          order.subtotal,
        ];

        if (showEmployeeInfo) row.push(order.employee_name);
        if (showCustomerInfo) row.push(order.user_name);
        if (showAmounts) row.push(order.total_amount);

        row.push(
          order.payment_status,
          new Date(order.created_at).toLocaleString()
        );

        return row;
      }),
    ];

    const blob = new Blob(
      [sheetContent.map((row) => row.join("\t")).join("\n")],
      { type: "text/tab-separated-values" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `orders-export-${timeframe}-${
      new Date().toISOString().split("T")[0]
    }.tsv`;
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
                <DropdownMenuItem onClick={handleGoogleSheetsExport}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export for Google Sheets</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExcelExport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCSVExport}>
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
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
              />
              <OrderTableSettings
                settings={{
                  showAmounts,
                  showEmployeeInfo,
                  showCustomerInfo,
                  statusFilter,
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
            orders={timeframeOrders}
            settings={tableSettings}
            onSort={handleSort}
            onStatusUpdate={handleUpdatePaymentStatus}
            isDetailsDialogOpen={isDetailsDialogOpen}
            setIsDetailsDialogOpen={setIsDetailsDialogOpen}
            selectedOrder={selectedOrder}
          />

          {/* Pagination */}
          <OrderTablePagination
            totalItems={timeframeOrders.length}
            pageSize={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
