"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/business/retail/owner/overview/DateRangePicker";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import { Download } from "lucide-react";

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
              <p className="text-sm text-muted-foreground">
                Complete Business Analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDateRangePicker />
              <Button size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="border-b" />
        </div>
      </main>
    </SidebarLayout>
  );
}
