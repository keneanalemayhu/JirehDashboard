"use client";

import * as React from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { OrderTable } from "@/components/dashboard/business/retail/owner/orders/OrderTable";
import { OrderTableSettings } from "@/components/dashboard/business/retail/owner/orders/OrderTableSettings";
import { OrderTablePagination } from "@/components/dashboard/business/retail/owner/orders/OrderTablePagination";
import { OrderForm } from "@/components/dashboard/business/retail/owner/orders/OrderForm";
import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Order,
  OrderFormData,
  ColumnVisibility,
} from "@/types/dashboard/business/retail/owner/order";

export default function OrdersPage() {
  const {
    orders,
    filterValue,
    setFilterValue,
    handleAddOrder,
    handleEditOrder,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingOrder,
    setEditingOrder,
    columnsVisible,
    setColumnsVisible,
    handleSort,
    filteredOrders,
    paginatedOrders,
  } = useOrders();

  const totalOrders = orders?.length || 0;

  const handleEditSubmit = (data: OrderFormData) => {
    if (editingOrder) {
      handleEditOrder({
        ...data,
        id: editingOrder.id,
        subtotal: data.quantity * data.unitPrice,
        totalAmount: data.quantity * data.unitPrice,
      });
    }
  };

  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Orders</h1>
              <p className="text-sm text-gray-500">
                Total orders: {totalOrders}
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CirclePlus className="w-4 h-4 mr-2" />
                  Add Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Order</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new order.
                  </DialogDescription>
                </DialogHeader>
                <OrderForm onSubmit={handleAddOrder} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Filter and Settings */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filter orders..."
              className="max-w-sm"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <OrderTableSettings
              columnsVisible={columnsVisible as ColumnVisibility}
              onColumnVisibilityChange={(
                column: keyof ColumnVisibility,
                visible: boolean
              ) =>
                setColumnsVisible((prev) => ({ ...prev, [column]: visible }))
              }
            />
          </div>

          {/* Table */}
          <OrderTable
            orders={paginatedOrders ?? []}
            columnsVisible={columnsVisible}
            onEdit={(order: Order) => {
              setEditingOrder({
                ...order,
              });
              setIsEditDialogOpen(true);
            }}
            isEditDialogOpen={isEditDialogOpen}
            setIsEditDialogOpen={setIsEditDialogOpen}
            editingOrder={editingOrder}
            onEditSubmit={handleEditSubmit}
          />

          {/* Pagination */}
          <OrderTablePagination
            totalItems={filteredOrders?.length ?? 0}
            pageSize={10}
            currentPage={1}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}
