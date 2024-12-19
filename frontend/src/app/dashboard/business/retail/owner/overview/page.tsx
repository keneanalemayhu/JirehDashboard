"use client";


import React, { useState, useMemo } from "react";
import html2canvas from "html2canvas";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  DollarSign,
  Download,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useOrders,
  initialOrders,
} from "@/hooks/dashboard/business/retail/owner/order";

declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable: any;
  }
}

export default function OverviewPage() {
  // State and hooks
  const [timeframe, setTimeframe] = useState("total");
  const {
    orders: allOrders,
    getTopSellingItems,
    getCustomerAnalytics,
    getAnalyticsByCategory,
  } = useOrders(initialOrders);

  // Memoized filtered orders with added quarterly and yearly filters
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return allOrders.filter((order) => {
      const orderDate = new Date(order.order_date);
      switch (timeframe) {
        case "today":
          return orderDate.toDateString() === now.toDateString();
        case "week":
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          return orderDate >= lastWeek;
        case "month":
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        case "quarter":
          const quarterStart = new Date(now);
          quarterStart.setMonth(Math.floor(now.getMonth() / 3) * 3);
          quarterStart.setDate(1);
          return orderDate >= quarterStart;
        case "year":
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [allOrders, timeframe]);

  // Calculate metrics from filtered orders
  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const uniqueCustomers = new Set(
      filteredOrders.map((order) => order.customer.phone)
    ).size;
    const averageOrderValue = totalRevenue / (filteredOrders.length || 1);

    return {
      totalRevenue,
      uniqueCustomers,
      averageOrderValue,
    };
  }, [filteredOrders]);

  // Calculate growth rate
  const growth = useMemo(() => {
    const currentTotal = filteredOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    // Get previous period's orders based on timeframe
    const now = new Date();
    const getPreviousPeriodStart = () => {
      switch (timeframe) {
        case "today":
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          return yesterday;
        case "week":
          const lastWeekStart = new Date(now);
          lastWeekStart.setDate(now.getDate() - 14);
          return lastWeekStart;
        case "month":
          const lastMonthStart = new Date(now);
          lastMonthStart.setMonth(now.getMonth() - 2);
          return lastMonthStart;
        case "quarter":
          const lastQuarterStart = new Date(now);
          lastQuarterStart.setMonth(now.getMonth() - 6);
          return lastQuarterStart;
        case "year":
          const lastYearStart = new Date(now);
          lastYearStart.setFullYear(now.getFullYear() - 2);
          return lastYearStart;
        default:
          return new Date(0); // Beginning of time for "all"
      }
    };

    const previousPeriodStart = getPreviousPeriodStart();
    const previousPeriodOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return (
        orderDate >= previousPeriodStart &&
        orderDate < new Date(filteredOrders[0]?.order_date)
      );
    });

    const previousTotal = previousPeriodOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    return previousTotal
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;
  }, [filteredOrders, allOrders, timeframe]);

  type RevenueDataPoint = {
    date: string;
    amount: number;
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    // Revenue chart data
    // In the chartData useMemo:
    const revenueChartData = filteredOrders.reduce(
      (acc: RevenueDataPoint[], order) => {
        const date = new Date(order.order_date).toLocaleDateString();
        const existingDay = acc.find((item) => item.date === date);

        if (existingDay) {
          existingDay.amount += order.total_amount;
        } else {
          acc.push({ date, amount: order.total_amount });
        }

        return acc;
      },
      []
    );

    const getPreviousPeriodStart = () => {
      const now = new Date();
      switch (timeframe) {
        case "today":
          return new Date(now.setDate(now.getDate() - 1));
        case "week":
          return new Date(now.setDate(now.getDate() - 7));
        case "month":
          return new Date(now.setMonth(now.getMonth() - 1));
        case "quarter":
          return new Date(now.setMonth(now.getMonth() - 3));
        case "year":
          return new Date(now.setFullYear(now.getFullYear() - 1));
        default:
          return new Date(0);
      }
    };

    // Payment methods chart data
    const paymentMethods = filteredOrders.reduce(
      (acc: { [key: string]: number }, order) => {
        acc[order.payment_method] = (acc[order.payment_method] || 0) + 1;
        return acc;
      },
      {}
    );

    const paymentMethodChartData = Object.entries(paymentMethods).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    return {
      revenueChartData,
      paymentMethodChartData,
    };
  }, [filteredOrders]);
  // Export functionality with charts

  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async (type: "pdf" | "csv") => {
    try {
    setIsExporting(true);
    const exportMetrics = [
      ["Revenue", `ETB ${metrics.totalRevenue.toLocaleString()}`],
      ["Growth", `${growth.toFixed(1)}%`],
      [
        "Average Order Value",
        `ETB ${metrics.averageOrderValue.toLocaleString()}`,
      ],
      ["Unique Customers", metrics.uniqueCustomers.toString()],
      ["Total Orders", filteredOrders.length.toString()],
    ];

    if (type === "pdf") {
      const doc = new jsPDF();

      // Add title and date
      doc.setFontSize(20);
      doc.text(`Business Overview Report - ${timeframe}`, 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

      // Add metrics table
      doc.autoTable({
        startY: 40,
        head: [["Metric", "Value"]],
        body: exportMetrics,
      });

      // Wait for charts to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        // Create and add revenue chart
        const revenueChartElement = document.querySelector(
          ".recharts-wrapper"
        ) as HTMLElement;
        if (revenueChartElement) {
          const canvas = await html2canvas(revenueChartElement);
          const imgData = canvas.toDataURL("image/png");
          doc.addPage();
          doc.text("Revenue Trend", 20, 20);
          doc.addImage(imgData, "PNG", 20, 30, 170, 80);
        }

        // Create and add payment methods pie chart
        const pieChartElement = document.querySelectorAll(
          ".recharts-wrapper"
        )[1] as HTMLElement;
        if (pieChartElement) {
          const canvas = await html2canvas(pieChartElement);
          const imgData = canvas.toDataURL("image/png");
          doc.addImage(imgData, "PNG", 20, 130, 170, 80);
          doc.text("Payment Methods Distribution", 20, 120);
        }
      } catch (error) {
        console.error("Error capturing charts:", error);
      }

      // Create and add revenue chart
      const revenueChartCanvas = document.querySelector(
        ".recharts-wrapper canvas"
      ) as HTMLCanvasElement;
      if (revenueChartCanvas) {
        const imgData = revenueChartCanvas.toDataURL("image/png");
        doc.addPage();
        doc.text("Revenue Trend", 20, 20);
        doc.addImage(imgData, "PNG", 20, 30, 170, 80);
      }

      // Create and add payment methods pie chart
      const pieChartCanvas = document.querySelectorAll(
        ".recharts-wrapper canvas"
      )[1] as HTMLCanvasElement;
      if (pieChartCanvas) {
        const imgData = pieChartCanvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 20, 130, 170, 80);
        doc.text("Payment Methods Distribution", 20, 120);
      }

      // Add top selling items
      doc.addPage();
      doc.text("Top Selling Items", 20, 20);
      const topItems = getTopSellingItems(5).map((item) => [
        item.item_name,
        `ETB ${item.total_revenue.toLocaleString()}`,
        `${item.total_quantity} units`,
      ]);
      doc.autoTable({
        startY: 30,
        head: [["Item Name", "Revenue", "Units Sold"]],
        body: topItems,
      });

      // Add category performance
      const categoryData = getAnalyticsByCategory()
        .slice(0, 5)
        .map((cat) => [
          cat.category_name,
          `ETB ${cat.total_revenue.toLocaleString()}`,
          cat.total_items.toString(),
          `ETB ${cat.average_order_value.toFixed(2)}`,
        ]);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Category", "Revenue", "Items Sold", "Avg Order Value"]],
        body: categoryData,
      });

      doc.save(
        `business-overview-${timeframe}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } else {
      // CSV export remains the same
      const csvContent = [["Metric", "Value"], ...exportMetrics]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `business-overview-${timeframe}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Export error:", error);
    } finally {
    setIsExporting(false);
  }
};

  // Get analytics data
  const topSellingItems = getTopSellingItems(5);
  const customerAnalytics = getCustomerAnalytics();
  const categoryAnalytics = getAnalyticsByCategory();

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 p-8 pt-6">
        <div className="flex flex-col gap-6">
          {/* Header with Export */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Business Overview</h2>
              <p className="text-sm text-muted-foreground">
                {timeframe === "today"
                  ? "Today's"
                  : timeframe === "week"
                  ? "This Week's"
                  : timeframe === "month"
                  ? "This Month's"
                  : "Overall"}{" "}
                performance metrics
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
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Time Navigation */}
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <ScrollArea className="w-full whitespace-nowrap">
                <Tabs value={timeframe} onValueChange={setTimeframe}>
                  <TabsList>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                    <TabsTrigger value="quarter">This Quarter</TabsTrigger>
                    <TabsTrigger value="year">This Year</TabsTrigger>
                    <TabsTrigger value="total">All Time</TabsTrigger>
                  </TabsList>
                </Tabs>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ETB {metrics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredOrders.length} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ETB{" "}
                  {metrics.averageOrderValue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Growth Rate
                </CardTitle>
                {growth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.abs(growth).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  vs previous {timeframe}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Daily revenue overview</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution of payment types</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.paymentMethodChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {chartData.paymentMethodChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${index * 45}, 70%, 50%)`}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Selling Items */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performing products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingItems.map((item, index) => (
                    <div
                      key={item.item_id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {index + 1}.
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {item.item_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.category_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ETB {item.total_revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.total_quantity} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryAnalytics.slice(0, 5).map((category, index) => (
                    <div
                      key={category.category_id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {category.category_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.total_items} items sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ETB {category.total_revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg. ETB {category.average_order_value.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Retention */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Retention</CardTitle>
                <CardDescription>Customer loyalty analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Returning Customers</p>
                      <p className="text-2xl font-bold">
                        {(
                          (customerAnalytics.length
                            ? customerAnalytics.filter(
                                (c) => c.total_orders > 1
                              ).length / customerAnalytics.length
                            : 0) * 100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Average Orders</p>
                      <p className="text-2xl font-bold">
                        {(
                          customerAnalytics.reduce(
                            (acc, curr) => acc + curr.total_orders,
                            0
                          ) / customerAnalytics.length
                        ).toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium mb-2">Top Customers</p>
                    {customerAnalytics
                      .sort((a, b) => b.total_amount - a.total_amount)
                      .slice(0, 3)
                      .map((customer, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {customer.customer_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.total_orders} orders
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ETB {customer.total_amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Avg. ETB {customer.average_order_value.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Performance</CardTitle>
                <CardDescription>Latest business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        Order Completion Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          (filteredOrders.length
                            ? filteredOrders.filter(
                                (order) => order.status === "COMPLETED"
                              ).length / filteredOrders.length
                            : 0) * 100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Payment Success Rate
                      </p>
                      <p className="text-2xl font-bold">
                        {(
                          (filteredOrders.filter(
                            (order) => order.payment_status === "PAID"
                          ).length /
                            filteredOrders.length) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium mb-2">
                      Performance Indicators
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Average Daily Orders</p>
                        <p className="text-sm font-medium">
                          {(
                            filteredOrders.length /
                            (timeframe === "today"
                              ? 1
                              : timeframe === "week"
                              ? 7
                              : timeframe === "month"
                              ? 30
                              : timeframe === "year"
                              ? 365
                              : timeframe === "quarter"
                              ? 90
                              : 1)
                          ).toFixed(1)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Average Order Processing Time</p>
                        <p className="text-sm font-medium">24 min</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">Customer Satisfaction Rate</p>
                        <p className="text-sm font-medium">95%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
