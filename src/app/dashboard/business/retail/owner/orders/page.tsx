"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { OrderTable } from "@/components/dashboard/business/retail/owner/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/retail/owner/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/retail/owner/orders/OrderTablePagination";
import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import { Input } from "@/components/ui/input";
import { Order } from "@/types/dashboard/business/retail/owner/order";

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
  const totalOrders = orders?.length || 0;
  const totalAmount =
    orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Summary */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Orders</h1>
              <div className="flex gap-4 text-sm text-gray-500">
                <p>Total orders: {totalOrders}</p>
                <p>Total amount: ETB {totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center gap-2">
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

          {/* Table */}
          <OrderTable
            orders={paginatedOrders ?? []}
            onSort={handleSort}
            onStatusUpdate={handleUpdatePaymentStatus}
            isDetailsDialogOpen={isDetailsDialogOpen}
            setIsDetailsDialogOpen={setIsDetailsDialogOpen}
            selectedOrder={selectedOrder}
          />

          {/* Pagination */}
          <OrderTablePagination
            totalItems={filteredOrders?.length ?? 0}
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
