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
import { useLocations } from "@/hooks/dashboard/business/location";

export default function OrdersPage() {
  const { locations } = useLocations();
  const selectedLocation = locations[0]; // Assuming the first location is selected
  const locationId = selectedLocation?.id || 0;

  const {
    orders,
    paginatedOrders,
    isLoading,
    error,
    filters,
    setFilters,
    selectedOrder,
    currentPage,
    pageSize,
    totalPages,
    setPage,
    setPageSize,
    updateOrder,
    handleSort,
    sortColumn,
    sortDirection,
    refresh,
  } = useOrders(locationId);

  const [showAmounts, setShowAmounts] = React.useState(true);
  const [showEmployeeInfo, setShowEmployeeInfo] = React.useState(true);
  const [showCustomerInfo, setShowCustomerInfo] = React.useState(true);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const completed = orders.filter(order => order.status === 'completed').length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    
    return {
      total,
      completed,
      pending,
      cancelled,
      count: orders.length
    };
  }, [orders]);

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    console.log("Export to", format);
  };

  const handleSearch = (term: string) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: term.toLowerCase()
    }));
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

  const handleStatusChange = (status: string) => {
    setFilters((prev: OrderFilters) => ({ ...prev, status: status as OrderFilters["status"] }));
  };

  const handleTimeframeChange = (timeframe: string) => {
    setFilters((prev: OrderFilters) => ({ ...prev, timeframe: timeframe as OrderFilters["timeframe"] }));
  };

  if (!locationId) {
    return (
      <div className="flex min-h-screen">
        <SidebarLayout>
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <Header
                heading="Orders"
                text="Please select a location to view orders"
              />
            </div>
          </div>
        </SidebarLayout>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SidebarLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between">
            <Header
              heading="Orders"
              text="View and manage your orders"
            />
          </div>

          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{stats.count}</div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">Completed Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">ETB {stats.total.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  placeholder="Search orders..."
                  className="h-8 w-[150px] lg:w-[250px]"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Tabs
                  defaultValue="all"
                  className="w-full"
                  onValueChange={handleTimeframeChange}
                >
                  <TabsList>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="this_week">This Week</TabsTrigger>
                    <TabsTrigger value="this_month">This Month</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto hidden h-8 lg:flex"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExport("csv")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export to CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("excel")}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf")}>
                      <FileDown className="mr-2 h-4 w-4" />
                      Export to PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <OrderTableSettings
              showAmounts={showAmounts}
              showEmployeeInfo={showEmployeeInfo}
              showCustomerInfo={showCustomerInfo}
              onShowAmountsChange={setShowAmounts}
              onShowEmployeeInfoChange={setShowEmployeeInfo}
              onShowCustomerInfoChange={setShowCustomerInfo}
            />

            <OrderTable
              orders={filteredOrders}
              showAmounts={showAmounts}
              showEmployeeInfo={showEmployeeInfo}
              showCustomerInfo={showCustomerInfo}
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              isLoading={isLoading}
            />

            <OrderTablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={orders.length}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </div>
        </div>
      </SidebarLayout>
    </div>
  );
}