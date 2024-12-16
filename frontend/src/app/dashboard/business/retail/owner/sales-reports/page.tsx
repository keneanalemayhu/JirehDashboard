"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/business/retail/owner/overview/DateRangePicker";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import {
  Download,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const salesChartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
};

export default function SalesReportPage() {
  const { orders } = useOrders();

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = orders.reduce((acc, order) => acc + order.total_amount, 0);
    const totalUnits = orders.reduce((acc, order) => acc + order.quantity, 0);
    const uniqueCustomers = new Set(orders.map((order) => order.user_name))
      .size;
    const avgOrderValue = total / orders.length;

    const prevMonthTotal = orders
      .filter((order) => {
        const date = new Date(order.created_at);
        const prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        return date.getMonth() === prevMonth.getMonth();
      })
      .reduce((acc, order) => acc + order.total_amount, 0);

    const currentMonthTotal = orders
      .filter((order) => {
        const date = new Date(order.created_at);
        const now = new Date();
        return date.getMonth() === now.getMonth();
      })
      .reduce((acc, order) => acc + order.total_amount, 0);

    const percentageChange =
      ((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100;

    return {
      total,
      totalUnits,
      uniqueCustomers,
      avgOrderValue,
      percentageChange,
    };
  }, [orders]);

  // Product Performance Data
  const productPerformance = useMemo(() => {
    const performance = orders.reduce((acc, order) => {
      if (!acc[order.item_name]) {
        acc[order.item_name] = {
          name: order.item_name,
          totalSales: 0,
          totalRevenue: 0,
          averagePrice: 0,
          unitsSold: 0,
        };
      }
      acc[order.item_name].totalSales += order.total_amount;
      acc[order.item_name].unitsSold += order.quantity;
      acc[order.item_name].totalRevenue += order.total_amount;
      acc[order.item_name].averagePrice =
        acc[order.item_name].totalRevenue / acc[order.item_name].unitsSold;
      return acc;
    }, {});

    return Object.values(performance).sort(
      (a, b) => b.totalSales - a.totalSales
    );
  }, [orders]);

  // Sales Distribution Chart Data
  const salesDistributionData = useMemo(() => {
    return productPerformance.slice(0, 5).map((item, index) => ({
      name: item.name,
      value: item.unitsSold,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [productPerformance]);

  // Sales Trend Data
  const salesTrendData = useMemo(() => {
    const monthlyData = orders.reduce((acc, order) => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          totalSales: 0,
          revenue: 0,
        };
      }

      acc[monthKey].totalSales += order.quantity;
      acc[monthKey].revenue += order.total_amount;
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, data]) => ({
        month: month,
        sales: data.totalSales,
        revenue: data.revenue,
      }));
  }, [orders]);

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Sales Report
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete Sales Report on Products Sold
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDateRangePicker />
              <Button size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.total.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      summaryMetrics.percentageChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {summaryMetrics.percentageChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(summaryMetrics.percentageChange).toFixed(1)}% from
                    last month
                  </span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Units Sold
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.totalUnits.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average{" "}
                  {(summaryMetrics.totalUnits / orders.length).toFixed(1)} units
                  per order
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.uniqueCustomers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(orders.length / summaryMetrics.uniqueCustomers).toFixed(1)}{" "}
                  orders per customer
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Order Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.avgOrderValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Sales</CardTitle>
                <CardDescription>
                  Distribution of top 5 selling products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={salesChartConfig}
                  className="aspect-square h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={salesDistributionData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      stroke="none"
                    >
                      <Label
                        content={({ viewBox }) => (
                          <text
                            x={viewBox?.cx}
                            y={viewBox?.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox?.cx}
                              y={viewBox?.cy}
                              className="text-2xl font-bold fill-foreground"
                            >
                              {summaryMetrics.totalUnits.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox?.cx}
                              y={(viewBox?.cy || 0) + 20}
                              className="text-sm fill-muted-foreground"
                            >
                              Total Units
                            </tspan>
                          </text>
                        )}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Trends</CardTitle>
                <CardDescription>
                  Monthly sales and revenue overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={salesChartConfig} className="h-[300px]">
                  <AreaChart
                    data={salesTrendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="2"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.5}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Product Performance Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>
                    Detailed breakdown of product sales and revenue
                  </CardDescription>
                </div>
                <Select defaultValue="revenue">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Sort by Revenue</SelectItem>
                    <SelectItem value="units">Sort by Units Sold</SelectItem>
                    <SelectItem value="average">
                      Sort by Average Price
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg. Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPerformance.map((product) => (
                    <TableRow key={product.name}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.unitsSold.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.totalRevenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.averagePrice.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}
