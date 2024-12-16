"use client";
import React from "react";
import OrderPage from "@/components/dashboard/business/retail/sales/new-order/OrderPage";
import { Header } from "@/components/common/dashboard/business/retail/sales/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/sales/Sidebar";

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <Header />
      <OrderPage />
    </SidebarLayout>
  );
}
