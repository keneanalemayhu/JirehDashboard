"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Download,
  FileText,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSwapy } from "swapy";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import { useItems } from "@/hooks/dashboard/business/retail/admin/item";
import { useCategories } from "@/hooks/dashboard/business/retail/admin/category";
import { useEmployees } from "@/hooks/dashboard/business/retail/admin/employee";
import { useExpenses } from "@/hooks/dashboard/business/retail/owner/expense";

export default function AnalysisPage() {
  const [timeframe, setTimeframe] = useState("total");
  const chartsContainerRef = useRef(null);
  const performanceContainerRef = useRef(null);

  const { orders, getFilteredOrdersByTimeframe } = useOrders();
  const { items } = useItems();
  const { categories } = useCategories();
  const { employees } = useEmployees();
  const { expenses } = useExpenses();

  // Initialize Swapy
  useEffect(() => {
    if (chartsContainerRef.current) {
      const chartsSwap = createSwapy(chartsContainerRef.current, {
        animation: "dynamic",
      });
      return () => chartsSwap.destroy();
    }
  }, []);

  useEffect(() => {
    if (performanceContainerRef.current) {
      const performanceSwap = createSwapy(performanceContainerRef.current, {
        animation: "dynamic",
      });
      return () => performanceSwap.destroy();
    }
  }, []);

  // Get filtered orders based on timeframe
  const timeframeOrders = getFilteredOrdersByTimeframe(timeframe);

  // Sales Trend Analysis
  const salesTrends = useMemo(() => {
    const monthlyData = timeframeOrders.reduce((acc, order) => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          revenue: 0,
          orders: 0,
          averageOrderValue: 0,
        };
      }

      acc[monthKey].revenue += order.total_amount;
      acc[monthKey].orders += 1;
      acc[monthKey].averageOrderValue =
        acc[monthKey].revenue / acc[monthKey].orders;

      return acc;
    }, {});

    return Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [timeframeOrders]);

  // Category Performance
  const categoryAnalysis = useMemo(() => {
    const analysis = timeframeOrders.reduce((acc, order) => {
      const item = items.find((i) => i.name === order.item_name);
      const category = item?.category || "Uncategorized";

      if (!acc[category]) {
        acc[category] = {
          category,
          revenue: 0,
          orders: 0,
          averageValue: 0,
        };
      }

      acc[category].revenue += order.total_amount;
      acc[category].orders += 1;
      acc[category].averageValue = acc[category].revenue / acc[category].orders;

      return acc;
    }, {});

    return Object.values(analysis).sort((a, b) => b.revenue - a.revenue);
  }, [timeframeOrders, items]);

  // Employee Performance Metrics
  const employeePerformance = useMemo(() => {
    return employees
      .map((employee) => {
        const employeeOrders = timeframeOrders.filter(
          (order) => order.employee_name === employee.name
        );
        const totalSales = employeeOrders.reduce(
          (sum, order) => sum + order.total_amount,
          0
        );
        const averageOrderValue = totalSales / (employeeOrders.length || 1);

        return {
          name: employee.name,
          totalSales,
          orderCount: employeeOrders.length,
          averageOrderValue,
          conversionRate:
            (employeeOrders.length / timeframeOrders.length) * 100,
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [timeframeOrders, employees]);

  // Export functionality
  const handleExport = (type: "pdf" | "csv") => {
    if (type === "pdf") {
      const doc = new jsPDF();
      doc.text(`Business Analysis Report - ${timeframe}`, 20, 20);
      // ... rest of your PDF export logic
      doc.save(
        `business-analysis-${timeframe}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } else {
      // ... your CSV export logic
    }
  };

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        {/* Header with export options */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Analysis</h2>
            <p className="text-sm text-muted-foreground">
              {timeframe === "today"
                ? "Today's"
                : timeframe === "week"
                ? "This Week's"
                : timeframe === "month"
                ? "This Month's"
                : timeframe === "quarter"
                ? "This Quarter's"
                : timeframe === "year"
                ? "This Year's"
                : "Total"}{" "}
              performance analysis
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileText className="h-4 w-4 mr-2" />
                Download CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Time Navigation */}
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <Tabs
              defaultValue="total"
              value={timeframe}
              onValueChange={setTimeframe}
            >
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
                <TabsTrigger value="quarter">This Quarter</TabsTrigger>
                <TabsTrigger value="year">This Year</TabsTrigger>
                <TabsTrigger value="total">Total</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Charts Section with Swapy */}
        <div ref={chartsContainerRef} className="grid gap-4 md:grid-cols-2">
          {/* Sales Trend Chart */}
          <div data-swapy-slot="sales-trend" className="md:col-span-2">
            <div data-swapy-item="sales-trend-chart">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend Analysis</CardTitle>
                  <CardDescription>
                    {timeframe} revenue and order trends
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => {
                          const [, month] = value.split("-");
                          return new Date(
                            2024,
                            parseInt(month) - 1
                          ).toLocaleString("default", { month: "short" });
                        }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#22c55e"
                        name="Revenue"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#3b82f6"
                        name="Orders"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Category Charts */}
          <div data-swapy-slot="category-revenue">
            <div data-swapy-item="category-revenue-chart">
              <Card>
                <CardHeader>
                  <CardTitle>Category Revenue Distribution</CardTitle>
                  <CardDescription>
                    Revenue breakdown by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          <div data-swapy-slot="category-orders">
            <div data-swapy-item="category-orders-chart">
              <Card>
                <CardHeader>
                  <CardTitle>Category Order Distribution</CardTitle>
                  <CardDescription>Order volume by category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryAnalysis}
                        dataKey="orders"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#3b82f6"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Employee Performance Section */}
        <div
          ref={performanceContainerRef}
          className="grid gap-4 md:grid-cols-2"
        >
          {/* Employee Sales Performance */}
          <div data-swapy-slot="employee-sales" className="md:col-span-2">
            <div data-swapy-item="employee-sales-chart">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Sales Performance</CardTitle>
                  <CardDescription>
                    {timeframe} sales performance ranking by employee
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {employeePerformance.slice(0, 5).map((emp) => (
                      <div key={emp.name} className="flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{emp.name}</span>
                          <span className="text-muted-foreground">
                            ${emp.totalSales.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${
                                (emp.totalSales /
                                  employeePerformance[0].totalSales) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Employee Order Volume */}
          <div data-swapy-slot="employee-orders">
            <div data-swapy-item="employee-orders-chart">
              <Card>
                <CardHeader>
                  <CardTitle>Order Volume by Employee</CardTitle>
                  <CardDescription>Number of orders processed</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employeePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orderCount" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Average Order Value */}
          <div data-swapy-slot="employee-avg-value">
            <div data-swapy-item="employee-avg-value-chart">
              <Card>
                <CardHeader>
                  <CardTitle>Average Order Value</CardTitle>
                  <CardDescription>
                    Average sale per transaction
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={employeePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="averageOrderValue"
                        stroke="#22c55e"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}