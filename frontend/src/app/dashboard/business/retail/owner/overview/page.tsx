"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/business/retail/owner/overview/DateRangePicker";
import { Header } from "@/components/common/dashboard/business/retail/owner/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/owner/Sidebar";
import {
  Download,
  Users,
  Package,
  Store,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Percent
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import hooks
import { useEmployees } from "@/hooks/dashboard/business/retail/owner/employee";
import { useItems } from "@/hooks/dashboard/business/retail/owner/item";
import { useOrders } from "@/hooks/dashboard/business/retail/owner/order";
import { useLocations } from "@/hooks/dashboard/business/retail/owner/location";
import { useCategories } from "@/hooks/dashboard/business/retail/owner/category";
import { useUsers } from "@/hooks/dashboard/business/retail/owner/user";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function OverviewPage() {
  const {
    employees,
    isLoading: employeesLoading,
    error: employeesError,
  } = useEmployees();
  const { items, isLoading: itemsLoading, error: itemsError } = useItems();
  const {
    orders,
    filteredOrders,
    isLoading: ordersLoading,
    error: ordersError,
  } = useOrders();
  const {
    locations,
    isLoading: locationsLoading,
    error: locationsError,
  } = useLocations();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { users, isLoading: usersLoading, error: usersError } = useUsers();

  const isLoading =
    employeesLoading ||
    itemsLoading ||
    ordersLoading ||
    locationsLoading ||
    categoriesLoading ||
    usersLoading;
  const hasError =
    employeesError ||
    itemsError ||
    ordersError ||
    locationsError ||
    categoriesError ||
    usersError;

  // Enhanced Summary Metrics
  const summaryMetrics = useMemo(() => {
    if (isLoading) return null;

    const totalRevenue = filteredOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate month-over-month changes
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

    const currentMonthOrders = filteredOrders.filter(
      (order) => new Date(order.created_at).getMonth() === currentMonth
    );
    const lastMonthOrders = filteredOrders.filter(
      (order) => new Date(order.created_at).getMonth() === lastMonth
    );

    const currentMonthRevenue = currentMonthOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (acc, order) => acc + order.total_amount,
      0
    );

    const revenueGrowth =
      lastMonthRevenue === 0
        ? 100
        : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    // Inventory metrics
    const lowStockItems = items.filter((item) => item.quantity < 10).length;
    const outOfStockItems = items.filter((item) => item.quantity === 0).length;
    const inventoryValue = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Employee performance
    const employeePerformance = employees
      .map((employee) => {
        const employeeOrders = filteredOrders.filter(
          (order) => order.employee_id === employee.id
        );
        return {
          employeeId: employee.id,
          name: employee.full_name,
          totalSales: employeeOrders.reduce(
            (acc, order) => acc + order.total_amount,
            0
          ),
          orderCount: employeeOrders.length,
        };
      })
      .sort((a, b) => b.totalSales - a.totalSales);

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueGrowth,
      activeEmployees: employees.filter((emp) => emp.is_active).length,
      totalLocations: locations.length,
      totalProducts: items.length,
      activeUsers: users.filter((user) => user.is_active).length,
      lowStockItems,
      outOfStockItems,
      inventoryValue,
      employeePerformance,
      categoriesCount: categories.length,
      averageOrdersPerDay: totalOrders / 30, // Assuming 30 days
    };
  }, [filteredOrders, employees, locations, items, users, categories]);

  // Enhanced Category Performance
  const categoryPerformance = useMemo(() => {
    if (isLoading) return [];

    const categoryStats = new Map();
    categories.forEach((category) => {
      categoryStats.set(category.id, {
        name: category.name,
        revenue: 0,
        itemsSold: 0,
        itemCount: items.filter((item) => item.category_id === category.id)
          .length,
      });
    });

    filteredOrders.forEach((order) => {
      order.items?.forEach((orderItem) => {
        const item = items.find((i) => i.id === orderItem.item_id);
        if (item) {
          const stats = categoryStats.get(item.category_id);
          if (stats) {
            stats.revenue += orderItem.quantity * orderItem.unit_price;
            stats.itemsSold += orderItem.quantity;
          }
        }
      });
    });

    return Array.from(categoryStats.values()).sort(
      (a, b) => b.revenue - a.revenue
    );
  }, [categories, items, filteredOrders]);

  // Sales by Location
  const locationPerformance = useMemo(() => {
    if (isLoading) return [];

    return locations
      .map((location) => {
        const locationOrders = filteredOrders.filter(
          (order) => order.location_id === location.id
        );
        const revenue = locationOrders.reduce(
          (acc, order) => acc + order.total_amount,
          0
        );
        const orderCount = locationOrders.length;

        return {
          name: location.name,
          revenue,
          orderCount,
          averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [locations, filteredOrders]);

  if (hasError) {
    return (
      <SidebarLayout>
        <Header />
        <main className="flex-1 p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading dashboard data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </main>
      </SidebarLayout>
    );
  }

  if (isLoading || !summaryMetrics) {
    return (
      <SidebarLayout>
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-[150px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-[100px]" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Dashboard Overview
              </h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive business analytics and insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CalendarDateRangePicker />
              <Button size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Primary Metrics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {summaryMetrics.revenueGrowth >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={
                      summaryMetrics.revenueGrowth >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {Math.abs(summaryMetrics.revenueGrowth).toFixed(1)}%
                  </span>
                  <span className="ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Value
                </CardTitle>
                <Boxes className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.inventoryValue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summaryMetrics.lowStockItems} items low stock
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Order Value
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.avgOrderValue.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {summaryMetrics.totalOrders} total orders
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.activeUsers}
                </div>
                <div className="text-xs text-muted-foreground">
                  Across {summaryMetrics.totalLocations} locations
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPerformance}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        label
                      >
                        {categoryPerformance.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Location Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Revenue by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Employees</CardTitle>
              <CardDescription>Sales performance by employee</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="text-right">Avg Sale Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summaryMetrics.employeePerformance
                    .slice(0, 5)
                    .map((employee) => (
                      <TableRow key={employee.employeeId}>
                        <TableCell className="font-medium">
                          {employee.name}
                        </TableCell>
                        <TableCell>
                          ${employee.totalSales.toLocaleString()}
                        </TableCell>
                        <TableCell>{employee.orderCount}</TableCell>
                        <TableCell className="text-right">
                          $
                          {(
                            employee.totalSales / employee.orderCount || 0
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Inventory Status */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>
                  Stock levels requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Low Stock Warning */}
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium">Low Stock Items</p>
                        <p className="text-sm text-muted-foreground">
                          {summaryMetrics.lowStockItems} items below threshold
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>

                  {/* Out of Stock Warning */}
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Out of Stock</p>
                        <p className="text-sm text-muted-foreground">
                          {summaryMetrics.outOfStockItems} items need reordering
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Items per category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryPerformance}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip />
                      <Bar dataKey="itemCount" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Total {summaryMetrics.totalProducts} products across{" "}
                  {summaryMetrics.categoriesCount} categories
                </p>
              </CardFooter>
            </Card>
          </div>

          {/* Recent Orders with Enhanced Details */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest transactions with detailed metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.slice(0, 5).map((order) => {
                    const location = locations.find(
                      (loc) => loc.id === order.location_id
                    );
                    const employee = employees.find(
                      (emp) => emp.id === order.employee_id
                    );
                    const orderItems = order.items?.length || 0;

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{location?.name || "Unknown"}</TableCell>
                        <TableCell>
                          {employee?.full_name || "Unknown"}
                        </TableCell>
                        <TableCell>{orderItems}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          ${order.total_amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing last 5 of {summaryMetrics.totalOrders} orders
              </div>
              <Button variant="outline" size="sm">
                View All Orders
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}