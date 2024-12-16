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
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  DollarSign,
  Download,
  Package,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import { useItems } from "@/hooks/dashboard/business/retail/admin/item";
import { useUsers } from "@/hooks/dashboard/business/retail/owner/user";
import { useLocations } from "@/hooks/dashboard/business/retail/admin/location";
import { useEmployees } from "@/hooks/dashboard/business/retail/admin/employee";
import { useExpenses } from "@/hooks/dashboard/business/retail/owner/expense";
import { useCategories } from "@/hooks/dashboard/business/retail/admin/category";

export default function OverviewPage() {
  const { orders, getFilteredOrdersByTimeframe } = useOrders();
  const { items } = useItems();
  const { users } = useUsers();
  const { locations } = useLocations();
  const { employees } = useEmployees();
  const { expenses } = useExpenses();
  const { categories } = useCategories();

  // Time-based metrics
  const todayOrders = getFilteredOrdersByTimeframe("today");
  const weekOrders = getFilteredOrdersByTimeframe("week");
  const monthOrders = getFilteredOrdersByTimeframe("month");

  // Financial Metrics
  const financialMetrics = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = (netProfit / totalRevenue) * 100;

    // Calculate week-over-week growth
    const thisWeekRevenue = weekOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const lastWeekOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return orderDate >= twoWeeksAgo && orderDate < oneWeekAgo;
    });
    const lastWeekRevenue = lastWeekOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const weekOverWeekGrowth =
      ((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      weekOverWeekGrowth,
    };
  }, [orders, expenses, weekOrders]);

  // Inventory Insights
  const inventoryMetrics = useMemo(() => {
    const lowStockItems = items.filter((item) => item.quantity < 10);
    const outOfStockItems = items.filter((item) => item.quantity === 0);
    const totalInventoryValue = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const itemsByCategory = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      lowStockItems,
      outOfStockItems,
      totalInventoryValue,
      itemsByCategory,
    };
  }, [items]);

  // Staff Performance
  const staffMetrics = useMemo(() => {
    const salesByEmployee = orders.reduce((acc, order) => {
      acc[order.employee_name] =
        (acc[order.employee_name] || 0) + order.total_amount;
      return acc;
    }, {} as Record<string, number>);

    const topPerformers = Object.entries(salesByEmployee)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      salesByEmployee,
      topPerformers,
      activeEmployees: employees.filter((emp) => emp.isActive).length,
      totalEmployees: employees.length,
    };
  }, [orders, employees]);

  // Sales Analysis
  const salesMetrics = useMemo(() => {
    const averageOrderValue =
      orders.length > 0
        ? orders.reduce((sum, order) => sum + order.total_amount, 0) /
          orders.length
        : 0;

    const salesByCategory = orders.reduce((acc, order) => {
      const category =
        items.find((item) => item.name === order.item_name)?.category ||
        "Unknown";
      acc[category] = (acc[category] || 0) + order.total_amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      averageOrderValue,
      salesByCategory,
      dailyOrders: todayOrders.length,
      weeklyOrders: weekOrders.length,
      monthlyOrders: monthOrders.length,
    };
  }, [orders, items, todayOrders, weekOrders, monthOrders]);
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Title with Date
    doc.setFontSize(20);
    doc.text("Business Overview Report", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 30, {
      align: "center",
    });

    // Summary Section
    doc.setFontSize(16);
    doc.text("Summary Metrics", 14, 45);

    const summaryData = [
      ["Total Revenue", `$${financialMetrics.totalRevenue.toLocaleString()}`],
      ["Net Profit", `$${financialMetrics.netProfit.toLocaleString()}`],
      [
        "Inventory Value",
        `$${inventoryMetrics.totalInventoryValue.toLocaleString()}`,
      ],
      ["Average Order Value", `$${salesMetrics.averageOrderValue.toFixed(2)}`],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
    });

    // Save with date in filename
    const dateString = new Date().toISOString().split("T")[0];
    doc.save(`business-overview-${dateString}.pdf`);
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
      [`Business Overview Report - Generated on ${formattedDate}`],
      [],
      ["Summary Metrics"],
      ["Total Revenue", `$${financialMetrics.totalRevenue.toLocaleString()}`],
      ["Net Profit", `$${financialMetrics.netProfit.toLocaleString()}`],
      [
        "Inventory Value",
        `$${inventoryMetrics.totalInventoryValue.toLocaleString()}`,
      ],
      ["Average Order Value", `$${salesMetrics.averageOrderValue.toFixed(2)}`],
      [],
      ["Staff Metrics"],
      ["Total Employees", staffMetrics.totalEmployees],
      ["Active Employees", staffMetrics.activeEmployees],
      [],
      ["Inventory Metrics"],
      ["Low Stock Items", inventoryMetrics.lowStockItems.length],
      ["Out of Stock Items", inventoryMetrics.outOfStockItems.length],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `business-overview-${dateString}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">
              Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Comprehensive analysis of business performance and metrics
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

        {/* Financial Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-green-50 dark:bg-green-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${financialMetrics.totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm">
                {financialMetrics.weekOverWeekGrowth >= 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    financialMetrics.weekOverWeekGrowth >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {Math.abs(financialMetrics.weekOverWeekGrowth).toFixed(1)}%
                  WoW
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${financialMetrics.netProfit.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {financialMetrics.profitMargin.toFixed(1)}% margin
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <Package className="h-4 w-4 text-yellow-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${inventoryMetrics.totalInventoryValue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {inventoryMetrics.lowStockItems.length} items low stock
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 dark:bg-purple-900/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Average Order
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-700" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${salesMetrics.averageOrderValue.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {salesMetrics.monthlyOrders} orders this month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Revenue Trend */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Daily revenue for the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekOrders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="created_at"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="total_amount"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Top performing categories</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(salesMetrics.salesByCategory).map(
                      ([name, value]) => ({
                        name,
                        value,
                      })
                    )}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {Object.entries(salesMetrics.salesByCategory).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(${index * 45}, 70%, 50%)`}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Staff</CardTitle>
              <CardDescription>Based on sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffMetrics.topPerformers.map(([name, sales], index) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-muted-foreground">
                        {index + 1}.
                      </span>
                      <span className="ml-2">{name}</span>
                    </div>
                    <span className="font-medium">
                      ${sales.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryMetrics.lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {item.quantity === 0 ? (
                        <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.quantity} units</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}
