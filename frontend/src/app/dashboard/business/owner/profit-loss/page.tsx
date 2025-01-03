"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/common/dashboard/business/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/owner/Sidebar";
import {
  Download,
  FileText,
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
  CardHeader,
  CardTitle,
  CardFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createSwapy } from "swapy";
import { useExpenses } from "@/hooks/dashboard/business/expense";
import { useOrders } from "@/hooks/dashboard/business/order";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const profitChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
};

const lossChartConfig = {
  expenses: { label: "Expenses", color: "hsl(var(--chart-3))" },
  costs: { label: "Costs", color: "hsl(var(--chart-4))" },
};

export default function ProfitLossPage() {
  const { expenses = [], filteredExpenses = [] } = useExpenses();
  const { orders = [], filteredOrders = [] } = useOrders();

  const metricsContainerRef = useRef(null);
  const chartsContainerRef = useRef(null);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    if (metricsContainerRef.current) {
      const metricsSwap = createSwapy(metricsContainerRef.current, {
        animation: "dynamic",
      });
      return () => metricsSwap.destroy();
    }
  }, []);

  useEffect(() => {
    if (chartsContainerRef.current) {
      const chartsSwap = createSwapy(chartsContainerRef.current, {
        animation: "dynamic",
      });
      return () => chartsSwap.destroy();
    }
  }, []);

  useEffect(() => {
    if (tableContainerRef.current) {
      const tableSwap = createSwapy(tableContainerRef.current, {
        animation: "dynamic",
      });
      return () => tableSwap.destroy();
    }
  }, []);

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc" as "asc" | "desc",
  });
  const [transactionFilter, setTransactionFilter] = useState("all");

  // Recent Transactions
  const recentTransactions = useMemo(() => {
    const transactions = [
      ...filteredOrders.map((order) => ({
        date: new Date(order.order_date),
        type: "Revenue",
        description: `Order ${order.order_number}`,
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
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return transactions;
  }, [filteredOrders, filteredExpenses]);

  const processedTransactions = useMemo(() => {
    let filtered = recentTransactions;

    if (transactionFilter !== "all") {
      filtered = recentTransactions.filter((transaction) =>
        transactionFilter === "revenue"
          ? transaction.isProfit
          : !transaction.isProfit
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (sortConfig.key === "amount") {
        return sortConfig.direction === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      if (sortConfig.key === "type" || sortConfig.key === "description") {
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [recentTransactions, sortConfig, transactionFilter]);

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

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

    const now = new Date();
    const currentMonth = now.getMonth();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);

    const prevMonthOrders = filteredOrders.filter(
      (order) => new Date(order.order_date).getMonth() === lastMonth.getMonth()
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
    const totalOrders = filteredOrders.length;
    const totalRevenue = summaryMetrics.totalRevenue;
    const salesCount = filteredOrders.reduce((acc, order) => acc + 1, 0);

    return [
      { name: "Sales", value: salesCount, fill: "hsl(var(--chart-1))" },
      { name: "Revenue", value: totalRevenue, fill: "hsl(var(--chart-2))" },
    ];
  }, [filteredOrders, summaryMetrics.totalRevenue]);

  const lossData = useMemo(() => {
    const totalExpenses = summaryMetrics.totalExpenses;
    const operationalCosts = totalExpenses * 0.7;
    return [
      { name: "Expenses", value: totalExpenses, fill: "hsl(var(--chart-3))" },
      {
        name: "Operational Costs",
        value: operationalCosts,
        fill: "hsl(var(--chart-4))",
      },
    ];
  }, [summaryMetrics.totalExpenses]);

  const trendData = useMemo(() => {
    const monthlyData = new Map();

    filteredOrders.forEach((order) => {
      const date = new Date(order.order_date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { month: monthKey, profit: 0, loss: 0 });
      }
      const data = monthlyData.get(monthKey);
      data.profit += order.total_amount;
    });

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

  // Report generation handlers
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.setFontSize(20);
    doc.text("Profit & Loss Report", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Generated on: ${formattedDate}`, pageWidth / 2, 30, {
      align: "center",
    });

    doc.setFontSize(16);
    doc.text("Summary Metrics", 14, 45);

    doc.setFontSize(12);
    const summaryData = [
      ["Total Revenue", `$${summaryMetrics.totalRevenue.toLocaleString()}`],
      ["Total Expenses", `$${summaryMetrics.totalExpenses.toLocaleString()}`],
      ["Net Profit", `$${summaryMetrics.netProfit.toLocaleString()}`],
      ["Profit Margin", `${summaryMetrics.profitMargin.toFixed(1)}%`],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
    });

    doc.setFontSize(16);
    doc.text("Recent Transactions", 14, doc.lastAutoTable.finalY + 20);

    const transactionData = recentTransactions
      .slice(0, 10)
      .map((transaction) => [
        transaction.date.toLocaleDateString(),
        transaction.type,
        transaction.description,
        `${
          transaction.isProfit ? "+" : "-"
        }$${transaction.amount.toLocaleString()}`,
      ]);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Date", "Type", "Description", "Amount"]],
      body: transactionData,
      theme: "grid",
    });

    const dateString = currentDate.toISOString().split("T")[0];
    doc.save(`profit-loss-report-${dateString}.pdf`);
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
      [`Profit & Loss Report - Generated on ${formattedDate}`],
      [],
      ["Summary Metrics"],
      ["Total Revenue", `$${summaryMetrics.totalRevenue.toLocaleString()}`],
      ["Total Expenses", `$${summaryMetrics.totalExpenses.toLocaleString()}`],
      ["Net Profit", `$${summaryMetrics.netProfit.toLocaleString()}`],
      ["Profit Margin", `${summaryMetrics.profitMargin.toFixed(1)}%`],
      [],
      ["Recent Transactions"],
      ["Date", "Type", "Description", "Amount"],
      ...recentTransactions
        .slice(0, 10)
        .map((transaction) => [
          transaction.date.toLocaleDateString(),
          transaction.type,
          transaction.description,
          `${transaction.isProfit ? "+" : "-"}${transaction.amount}`,
        ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-loss-report-${dateString}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Profit & Loss
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete breakdown of Profit & Loss Analysis
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

          {/* Summary Cards */}
          <div ref={metricsContainerRef} className="grid gap-4 md:grid-cols-4">
            {/* Revenue Card */}
            <div data-swapy-slot="revenue">
              <div data-swapy-item="revenue-card">
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
                        {Math.abs(summaryMetrics.revenueChange).toFixed(1)}%
                        from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Expenses Card */}
            <div data-swapy-slot="expenses">
              <div data-swapy-item="expenses-card">
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
                        {Math.abs(summaryMetrics.expenseChange).toFixed(1)}%
                        from last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Net Profit Card */}
            <div data-swapy-slot="net-profit">
              <div data-swapy-item="net-profit-card">
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
              </div>
            </div>

            {/* Profit Margin Card */}
            <div data-swapy-slot="profit-margin">
              <div data-swapy-item="profit-margin-card">
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
            </div>
          </div>

          {/* Charts Section */}
          <div ref={chartsContainerRef} className="grid md:grid-cols-2 gap-4">
            {/* Profit Distribution Chart */}
            <div data-swapy-slot="profit-chart">
              <Card data-swapy-item="profit-distribution">
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
            </div>

            {/* Loss Distribution Chart */}
            <div data-swapy-slot="loss-chart">
              <Card data-swapy-item="loss-distribution">
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
            </div>

            {/* Trend Chart */}
            <div data-swapy-slot="trend-chart" className="md:col-span-2">
              <Card data-swapy-item="trend-analysis" className="md:col-span-2">
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
          </div>

          {/* Recent Transactions */}
          <div ref={tableContainerRef}>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Latest financial activities
                    </CardDescription>
                  </div>
                  <Select
                    value={transactionFilter}
                    onValueChange={setTransactionFilter}
                  >
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
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        Date{" "}
                        {sortConfig.key === "date" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        Type{" "}
                        {sortConfig.key === "type" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort("description")}
                      >
                        Description{" "}
                        {sortConfig.key === "description" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer"
                        onClick={() => handleSort("amount")}
                      >
                        Amount{" "}
                        {sortConfig.key === "amount" &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedTransactions.map((transaction, index) => (
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
        </div>
      </main>
    </SidebarLayout>
  );
}
