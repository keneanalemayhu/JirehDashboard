"use client";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/components/dashboard/sadmin/overview/DateRangePicker";
import { Header } from "@/components/common/dashboard/sadmin/Header";
import { SidebarLayout } from "@/components/common/dashboard/sadmin/Sidebar";
import { Download } from "lucide-react";

export default function DashboardPage() {
  const [value, setValue] = React.useState("overview");

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </h2>

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={(value) => setValue(value)}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4">
                <ScrollArea className="w-full sm:w-fit whitespace-nowrap">
                  <TabsList className="w-fit justify-start">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </TabsList>
                </ScrollArea>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <CalendarDateRangePicker />
                  <Button className="w-fit">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="border-b" />
            </div>

            <TabsContent value="overview" className="space-y-4"></TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarLayout>
  );
}
