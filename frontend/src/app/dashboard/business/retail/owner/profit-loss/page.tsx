"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/business/retail/owner/overview/DateRangePicker";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  PiggyBank,
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
import { useExpenses } from "@/hooks/dashboard/business/retail/owner/expense";
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

const profitChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
};

const lossChartConfig = {
  expenses: { label: "Expenses", color: "hsl(var(--chart-3))" },
  costs: { label: "Costs", color: "hsl(var(--chart-4))" },
};

export default function ProfitLossPage() {
  const { expenses, filteredExpenses } = useExpenses();
  const { orders, filteredOrders } = useOrders();

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    const totalExpenses = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin =
      totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Calculate previous month metrics
    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

    const prevMonthOrders = filteredOrders.filter(
      (order) => new Date(order.created_at).getMonth() === lastMonth.getMonth()
    );
    const prevMonthExpenses = filteredExpenses.filter(
      (expense) =>
        new Date(expense.expenseDate).getMonth() === lastMonth.getMonth()
    );

    const prevMonthRevenue = prevMonthOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    const prevMonthExpenses_total = prevMonthExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );

    const revenueChange =
      prevMonthRevenue > 0
        ? ((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        : 0;
    const expenseChange =
      prevMonthExpenses_total > 0
        ? ((totalExpenses - prevMonthExpenses_total) /
            prevMonthExpenses_total) *
          100
        : 0;

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      revenueChange,
      expenseChange,
    };
  }, [filteredOrders, filteredExpenses]);

  // Chart Data Calculations
  const profitData = useMemo(() => {
    const totalSales = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    return [
      { name: "Sales", value: totalSales, fill: "hsl(var(--chart-1))" },
      { name: "Revenue", value: totalRevenue, fill: "hsl(var(--chart-2))" },
    ];
  }, [filteredOrders]);

  const lossData = useMemo(() => {
    const totalExpenses = filteredExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    // Assuming operational costs are 70% of total expenses
    const operationalCosts = totalExpenses * 0.7;
    return [
      { name: "Expenses", value: totalExpenses, fill: "hsl(var(--chart-3))" },
      {
        name: "Operational Costs",
        value: operationalCosts,
        fill: "hsl(var(--chart-4))",
      },
    ];
  }, [filteredExpenses]);

  const trendData = useMemo(() => {
    const monthlyData = new Map();

    // Process orders
    filteredOrders.forEach((order) => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { month: monthKey, profit: 0, loss: 0 });
      }
      const data = monthlyData.get(monthKey);
      data.profit += order.total_amount;
    });

    // Process expenses
    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.expenseDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { month: monthKey, profit: 0, loss: 0 });
      }
      const data = monthlyData.get(monthKey);
      data.loss += expense.amount;
    });

    return Array.from(monthlyData.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);
  }, [filteredOrders, filteredExpenses]);

  // Recent Transactions
  const recentTransactions = useMemo(() => {
    const transactions = [
      ...filteredOrders.map((order) => ({
        date: new Date(order.created_at),
        type: "Revenue",
        description: `Order ${order.order_id}`,
        amount: order.total_amount,
        isProfit: true,
      })),
      ...filteredExpenses.map((expense) => ({
        date: new Date(expense.expenseDate),
        type: "Expense",
        description: expense.name,
        amount: expense.amount,
        isProfit: false,
      })),
    ]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    return transactions;
  }, [filteredOrders, filteredExpenses]);

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 space-y-6">
          {/* Header section */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Profit & Loss
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete breakdown of Profit & Loss Analysis
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
            {/* Revenue Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      summaryMetrics.revenueChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {summaryMetrics.revenueChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {Math.abs(summaryMetrics.revenueChange).toFixed(1)}% from
                    last month
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <Receipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.totalExpenses.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      summaryMetrics.expenseChange <= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {summaryMetrics.expenseChange <= 0 ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                    {Math.abs(summaryMetrics.expenseChange).toFixed(1)}% from
                    last month
                  </span>
                </p>
              </CardContent>
            </Card>

            {/* Net Profit Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Net Profit
                </CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.netProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Net earnings after expenses
                </p>
              </CardContent>
            </Card>

            {/* Profit Margin Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Profit Margin
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.profitMargin.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Of total revenue
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Profit Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Profit Distribution</CardTitle>
                <CardDescription>Revenue and Sales Overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={profitChartConfig}
                  className="aspect-square h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={profitData}
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
                              ${summaryMetrics.totalRevenue.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox?.cx}
                              y={(viewBox?.cy || 0) + 20}
                              className="text-sm fill-muted-foreground"
                            >
                              Total Profit
                            </tspan>
                          </text>
                        )}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">
                    {summaryMetrics.revenueChange.toFixed(1)}% from last month
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* Loss Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Loss Distribution</CardTitle>
                <CardDescription>Expenses and Costs Overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={lossChartConfig}
                  className="aspect-square h-[300px]"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={lossData}
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
                              ${summaryMetrics.totalExpenses.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox?.cx}
                              y={(viewBox?.cy || 0) + 20}
                              className="text-sm fill-muted-foreground"
                            >
                              Total Loss
                            </tspan>
                          </text>
                        )}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">
                    {summaryMetrics.expenseChange.toFixed(1)}% from last month
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* Trend Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profit & Loss Trends</CardTitle>
                <CardDescription>6-Month Overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={profitChartConfig}
                  className="h-[300px]"
                >
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(value) => {
                        const [year, month] = value.split("-");
                        return `${new Date(
                          parseInt(year),
                          parseInt(month) - 1
                        ).toLocaleString("default", { month: "short" })}`;
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stackId="1"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.5}
                      name="Profit"
                    />
                    <Area
                      type="monotone"
                      dataKey="loss"
                      stackId="2"
                      stroke="hsl(var(--chart-3))"
                      fill="hsl(var(--chart-3))"
                      fillOpacity={0.5}
                      name="Loss"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Showing profit and loss trends over the last 6 months
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest financial activities</CardDescription>
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="revenue">Revenue Only</SelectItem>
                    <SelectItem value="expenses">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {transaction.date.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell
                        className={`text-right ${
                          transaction.isProfit
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.isProfit ? "+" : "-"}$
                        {transaction.amount.toLocaleString()}
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
