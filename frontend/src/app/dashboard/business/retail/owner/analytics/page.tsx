"use client";

import { useMemo } from "react";
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
  DollarSign,
  TrendingUp,
  Download,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import { useItems } from "@/hooks/dashboard/business/retail/admin/item";
import { useCategories } from "@/hooks/dashboard/business/retail/admin/category";
import { useEmployees } from "@/hooks/dashboard/business/retail/admin/employee";
import { useExpenses } from "@/hooks/dashboard/business/retail/owner/expense";

export default function AnalysisPage() {
  const { orders, getFilteredOrdersByTimeframe } = useOrders();
  const { items } = useItems();
  const { categories } = useCategories();
  const { employees } = useEmployees();
  const { expenses } = useExpenses();

  // Sales Trend Analysis
  const salesTrends = useMemo(() => {
    const monthlyData = orders.reduce((acc, order) => {
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
  }, [orders]);

  // Category Performance
  const categoryAnalysis = useMemo(() => {
    const analysis = orders.reduce((acc, order) => {
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
  }, [orders, items]);

  // Employee Performance Metrics
  const employeePerformance = useMemo(() => {
    return employees
      .map((employee) => {
        const employeeOrders = orders.filter(
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
          conversionRate: (employeeOrders.length / orders.length) * 100,
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales);
  }, [orders, employees]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Title and Date
    doc.setFontSize(20);
    doc.text("Business Analysis Report", pageWidth / 2, 20, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 30, {
      align: "center",
    });

    // Sales Trends
    doc.setFontSize(16);
    doc.text("Sales Trends Analysis", 14, 45);
    const salesData = salesTrends.map((trend) => [
      trend.month,
      `$${trend.revenue.toLocaleString()}`,
      trend.orders,
      `$${trend.averageOrderValue.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 50,
      head: [["Month", "Revenue", "Orders", "Avg Order Value"]],
      body: salesData,
      theme: "grid",
    });

    // Category Performance
    doc.text("Category Performance", 14, doc.lastAutoTable.finalY + 20);
    const categoryData = categoryAnalysis.map((cat) => [
      cat.category,
      `$${cat.revenue.toLocaleString()}`,
      cat.orders,
      `$${cat.averageValue.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Category", "Revenue", "Orders", "Avg Value"]],
      body: categoryData,
      theme: "grid",
    });

    const dateString = new Date().toISOString().split("T")[0];
    doc.save(`business-analysis-${dateString}.pdf`);
  };

  const handleDownloadCSV = () => {
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split("T")[0];
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const csvContent = [
      [`Business Analysis Report - Generated on ${formattedDate}`],
      [],
      ["Sales Trends"],
      ["Month", "Revenue", "Orders", "Average Order Value"],
      ...salesTrends.map((trend) => [
        trend.month,
        trend.revenue,
        trend.orders,
        trend.averageOrderValue,
      ]),
      [],
      ["Category Performance"],
      ["Category", "Revenue", "Orders", "Average Value"],
      ...categoryAnalysis.map((cat) => [
        cat.category,
        cat.revenue,
        cat.orders,
        cat.averageValue,
      ]),
      [],
      ["Employee Performance"],
      [
        "Name",
        "Total Sales",
        "Order Count",
        "Average Order Value",
        "Conversion Rate",
      ],
      ...employeePerformance.map((emp) => [
        emp.name,
        emp.totalSales,
        emp.orderCount,
        emp.averageOrderValue,
        emp.conversionRate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-analysis-${dateString}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Detailed analysis of business performance and trends
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
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Download CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sales Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend Analysis</CardTitle>
            <CardDescription>Monthly revenue and order trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value) => {
                    const [, month] = value.split("-");
                    return new Date(2024, parseInt(month) - 1).toLocaleString(
                      "default",
                      { month: "short" }
                    );
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

        {/* Category Performance */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Category Revenue Distribution</CardTitle>
              <CardDescription>Revenue breakdown by category</CardDescription>
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

        {/* Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Performance Analysis</CardTitle>
            <CardDescription>Sales performance by employee</CardDescription>
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
                          (emp.totalSales / employeePerformance[0].totalSales) *
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
      </main>
    </SidebarLayout>
  );
}