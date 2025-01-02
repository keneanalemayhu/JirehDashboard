"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
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
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useOrder,
  initialOrders,
  getDateRangeForTimeframe,
} from "@/hooks/dashboard/business/order";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/owner";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function OverviewPage() {
  // State and hooks
  const { language } = useLanguage();
  const t = translations[language].dashboard.owner.page;
  const [timeframe, setTimeframe] = useState("total");
  const {
    orders: allOrders,
    getTopSellingItems,
    getCustomerAnalytics,
    getAnalyticsByCategory,
  } = useOrders(initialOrders);

  // Memoized filtered orders with added quarterly and yearly filters
  const filteredOrders = useMemo(() => {
    if (timeframe === "total") return allOrders;

    const dateRange = getDateRangeForTimeframe(timeframe);
    if (!dateRange) return allOrders;

    return allOrders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
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
    if (timeframe === "total") return 0;

    const dateRange = getDateRangeForTimeframe(timeframe);
    if (!dateRange) return 0;

    const currentPeriodOrders = filteredOrders;
    const currentTotal = currentPeriodOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );

    // Get previous period's orders based on timeframe
    const previousStart = new Date(dateRange.start);
    const previousEnd = new Date(dateRange.start);

    switch (timeframe) {
      case "today":
        previousStart.setDate(previousStart.getDate() - 1);
        previousEnd.setDate(previousEnd.getDate() - 1);
        previousEnd.setHours(23, 59, 59, 999);
        break;
      case "week":
        previousStart.setDate(previousStart.getDate() - 7);
        previousEnd.setDate(previousEnd.getDate() - 1);
        break;
      case "month":
        previousStart.setMonth(previousStart.getMonth() - 1);
        previousEnd.setDate(0);
        break;
      case "quarter":
        previousStart.setMonth(previousStart.getMonth() - 3);
        previousEnd.setTime(dateRange.start.getTime() - 1);
        break;
      case "year":
        previousStart.setFullYear(previousStart.getFullYear() - 1);
        previousEnd.setFullYear(previousEnd.getFullYear() - 1);
        previousEnd.setMonth(11, 31);
        break;
    }

    const previousPeriodOrders = allOrders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= previousStart && orderDate <= previousEnd;
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
    const revenueChartData = filteredOrders
      .reduce((acc: RevenueDataPoint[], order) => {
        const date = new Date(order.order_date).toLocaleDateString();
        const existingDay = acc.find((item) => item.date === date);

        if (existingDay) {
          existingDay.amount += order.total_amount;
        } else {
          acc.push({ date, amount: order.total_amount });
        }

        return acc;
      }, [])
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
        // Create new document with 'pt' units and A4 size
        const doc = new jsPDF("p", "pt", "a4");

        // Add title and date
        doc.setFontSize(20);
        doc.text(`Business Overview Report - ${timeframe}`, 40, 40);
        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 60);

        // Add metrics table with proper configuration
        doc.autoTable({
          startY: 80,
          head: [["Metric", "Value"]],
          body: exportMetrics,
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [66, 66, 66] },
          margin: { top: 80, right: 40, bottom: 40, left: 40 },
        });

        // Wait for charts to render
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
          // Capture and add revenue chart
          const revenueChartElement = document.querySelector(
            ".recharts-wrapper"
          ) as HTMLElement;
          if (revenueChartElement) {
            const canvas = await html2canvas(revenueChartElement);
            const imgData = canvas.toDataURL("image/png");
            doc.addPage();
            doc.text("Revenue Trend", 40, 40);
            doc.addImage(imgData, "PNG", 40, 60, 500, 250);
          }

          // Capture and add payment methods pie chart
          const pieChartElement = document.querySelectorAll(
            ".recharts-wrapper"
          )[1] as HTMLElement;
          if (pieChartElement) {
            doc.text("Payment Methods Distribution", 40, 340);
            const canvas = await html2canvas(pieChartElement);
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 40, 360, 500, 250);
          }

          // Add top selling items table
          doc.addPage();
          doc.text("Top Selling Items", 40, 40);
          const topItems = getTopSellingItems(5).map((item) => [
            item.item_name,
            `ETB ${item.total_revenue.toLocaleString()}`,
            `${item.total_quantity} units`,
          ]);

          doc.autoTable({
            startY: 60,
            head: [["Item Name", "Revenue", "Units Sold"]],
            body: topItems,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [66, 66, 66] },
            margin: { top: 60, right: 40, bottom: 40, left: 40 },
          });

          // Add category performance table
          const categoryData = getAnalyticsByCategory()
            .slice(0, 5)
            .map((cat) => [
              cat.category_name,
              `ETB ${cat.total_revenue.toLocaleString()}`,
              cat.total_items.toString(),
              `ETB ${cat.average_order_value.toFixed(2)}`,
            ]);

          doc.text(
            "Category Performance",
            40,
            doc.autoTable.previous.finalY + 40
          );

          doc.autoTable({
            startY: doc.autoTable.previous.finalY + 60,
            head: [["Category", "Revenue", "Items Sold", "Avg Order Value"]],
            body: categoryData,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [66, 66, 66] },
            margin: { top: 40, right: 40, bottom: 40, left: 40 },
          });
        } catch (error) {
          console.error("Error capturing charts:", error);
        }

        // Save the PDF
        doc.save(
          `business-overview-${timeframe}-${
            new Date().toISOString().split("T")[0]
          }.pdf`
        );
      } else {
        // CSV export logic remains the same
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
              <h2 className="text-3xl font-bold">
                {t.overview.business_overview}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t.overview.timeframe[timeframe] ||
                  t.overview.timeframe.all_time}{" "}
                {t.overview.performance_metrics}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  {t.overview.dropdown_menu.download_report}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t.overview.dropdown_menu.pdf}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileText className="h-4 w-4 mr-2" />
                  {t.overview.dropdown_menu.csv}
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
                    <TabsTrigger value="today">
                      {t.overview.tabs_trigger.today}
                    </TabsTrigger>
                    <TabsTrigger value="week">
                      {t.overview.tabs_trigger.week}
                    </TabsTrigger>
                    <TabsTrigger value="month">
                      {t.overview.tabs_trigger.month}
                    </TabsTrigger>
                    <TabsTrigger value="quarter">
                      {t.overview.tabs_trigger.quarter}
                    </TabsTrigger>
                    <TabsTrigger value="year">
                      {t.overview.tabs_trigger.year}
                    </TabsTrigger>
                    <TabsTrigger value="total">
                      {t.overview.tabs_trigger.all_time}
                    </TabsTrigger>
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
                  {t.overview.card.card_title.total_revenue}
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.totalRevenue.toLocaleString()}{" "}
                  {t.overview.card.card_content.etb}
                </div>
                <p className="text-xs text-muted-foreground">
                  {filteredOrders.length} {t.overview.card.card_content.orders}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.overview.card.card_title.average_order_value}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.averageOrderValue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {t.overview.card.card_content.etb}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.overview.card.card_content.per_transaction}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {t.overview.card.card_title.growth_rate}
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
                  {t.overview.card.card_content.vs_previous_total}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {t.overview.card.card_title.revenue_trend}
                </CardTitle>
                <CardDescription>
                  {" "}
                  {t.overview.card.card_description.revenue_trend_description}
                </CardDescription>
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
                <CardTitle>
                  {t.overview.card.card_title.payment_methods}
                </CardTitle>
                <CardDescription>
                  {" "}
                  {t.overview.card.card_description.payment_methods_description}
                </CardDescription>
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
                <CardTitle>
                  {t.overview.card.card_title.top_selling_item}
                </CardTitle>
                <CardDescription>
                  {" "}
                  {
                    t.overview.card.card_description
                      .top_selling_item_description
                  }
                </CardDescription>
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
                          {item.total_revenue.toLocaleString()}{" "}
                          {t.overview.card.card_content.etb}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.total_quantity}{" "}
                          {t.overview.card.card_content.units}
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
                <CardTitle>
                  {t.overview.card.card_title.category_performance}
                </CardTitle>
                <CardDescription>
                  {" "}
                  {
                    t.overview.card.card_description
                      .category_performance_description
                  }
                </CardDescription>
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
                          {category.total_items}{" "}
                          {t.overview.card.card_content.items_sold}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {category.total_revenue.toLocaleString()}{" "}
                          {t.overview.card.card_content.etb}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.overview.card.card_content.avg}{" "}
                          {category.average_order_value.toFixed(2)}{" "}
                          {t.overview.card.card_content.etb}
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
                <CardTitle>
                  {" "}
                  {t.overview.card.card_title.customer_retention}
                </CardTitle>
                <CardDescription>
                  {" "}
                  {
                    t.overview.card.card_description
                      .customer_retention_description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        {t.overview.card.card_content.returning_customers}
                      </p>
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
                      <p className="text-sm font-medium">
                        {t.overview.card.card_content.average_orders}
                      </p>
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
                    <p className="text-sm font-medium mb-2">
                      {t.overview.card.card_content.top_customers}
                    </p>
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
                              {customer.total_orders}{" "}
                              {t.overview.card.card_content.orders}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {customer.total_amount.toLocaleString()}{" "}
                              {t.overview.card.card_content.etb}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t.overview.card.card_content.avg}{" "}
                              {customer.average_order_value.toFixed(2)}{" "}
                              {t.overview.card.card_content.etb}
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
                <CardTitle>
                  {t.overview.card.card_title.recent_performance}
                </CardTitle>
                <CardDescription>
                  {" "}
                  {
                    t.overview.card.card_description
                      .recent_performance_description
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">
                        {t.overview.card.card_content.order_completion_rate}
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
                        {t.overview.card.card_content.payment_success_rate}
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
                      {t.overview.card.card_content.Performance_indicators}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          {t.overview.card.card_content.average_orders}
                        </p>
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
                        <p className="text-sm">
                          {
                            t.overview.card.card_content
                              .average_order_processing_time
                          }
                        </p>
                        <p className="text-sm font-medium">1.6 min</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          {
                            t.overview.card.card_content
                              .customer_satisfaction_rate
                          }
                        </p>
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
