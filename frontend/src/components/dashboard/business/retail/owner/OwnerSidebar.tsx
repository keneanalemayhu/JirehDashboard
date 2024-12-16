"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // Add this import
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  BookUser,
  LayoutDashboard,
  DollarSign,
  Package,
  Users,
} from "lucide-react";
import { NavMain } from "@/components/dashboard/business/retail/owner/OwnerNavMain";
import { NavUser } from "@/components/dashboard/business/retail/owner/OwnerNavUser";
import { TeamSwitcher } from "@/components/dashboard/business/retail/owner/OwnerTeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/retail/owner";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].dashboard.owner.sidebar;

  // This is sample data with translations
  const data = {
    user: {
      name: "Abebe",
      email: "abebe@example.com",
      avatar: "/public/avatar/avatar.png",
    },
    teams: [
      {
        name: t.teams.owner,
        logo: BookUser,
        plan: t.teams.ownerPlan,
        url: "/dashboard/business/retail/owner",
      },
      {
        name: t.teams.admin,
        logo: GalleryVerticalEnd,
        plan: t.teams.adminPlan,
        url: "/dashboard/business/retail/admin",
      },
      {
        name: t.teams.sales,
        logo: AudioWaveform,
        plan: t.teams.salesPlan,
        url: "/dashboard/business/retail/sales",
      },
      {
        name: t.teams.warehouse,
        logo: Command,
        plan: t.teams.warehousePlan,
        url: "/dashboard/business/retail/warehouse",
      },
    ],
    navMain: [
      {
        title: t.dashboard.title,
        url: "#",
        icon: LayoutDashboard,
        isActive: pathname.startsWith("/dashboard/business/retail/owner"),
        defaultOpen: true,
        items: [
          {
            title: t.dashboard.overview,
            url: "/dashboard/business/retail/owner/overview",
            isActive: pathname === "/dashboard/business/retail/owner/overview",
          },
          {
            title: t.dashboard.analytics,
            url: "/dashboard/business/retail/owner/analytics",
            isActive: pathname === "/dashboard/business/retail/owner/analytics",
          },
        ],
      },
      {
        title: t.sales_profit.title,
        url: "#",
        icon: DollarSign,
        isActive:
          pathname.includes("/dashboard/business/retail/owner/orders") ||
          pathname.includes("/dashboard/business/retail/owner/sales-reports") ||
          pathname.includes("/dashboard/business/retail/owner/expenses") ||
          pathname.includes("/dashboard/business/retail/owner/profit-loss"),
        defaultOpen: true,
        items: [
          {
            title: t.sales_profit.orders,
            url: "/dashboard/business/retail/owner/orders",
            isActive: pathname === "/dashboard/business/retail/owner/orders",
          },
          {
            title: t.sales_profit.sales_reports,
            url: "/dashboard/business/retail/owner/sales-reports",
            isActive:
              pathname === "/dashboard/business/retail/owner/sales-reports",
          },
          {
            title: t.sales_profit.expenses,
            url: "/dashboard/business/retail/owner/expenses",
            isActive: pathname === "/dashboard/business/retail/owner/expenses",
          },
          {
            title: t.sales_profit.proit_loss,
            url: "/dashboard/business/retail/owner/profit-loss",
            isActive:
              pathname === "/dashboard/business/retail/owner/profit-loss",
          },
        ],
      },
      {
        title: t.inventory.title,
        url: "#",
        icon: Package,
        isActive:
          pathname.includes("/dashboard/business/retail/owner/items") ||
          pathname.includes("/dashboard/business/retail/owner/categories") ||
          pathname.includes("/dashboard/business/retail/owner/stock-alerts") ||
          pathname.includes("/dashboard/business/retail/owner/transfer"),
        defaultOpen: true,
        items: [
          {
            title: t.inventory.items,
            url: "/dashboard/business/retail/owner/items",
            isActive: pathname === "/dashboard/business/retail/owner/items",
          },
          {
            title: t.inventory.categories,
            url: "/dashboard/business/retail/owner/categories",
            isActive:
              pathname === "/dashboard/business/retail/owner/categories",
          },
          {
            title: t.inventory.transfer,
            url: "/dashboard/business/retail/owner/transfer",
            isActive: pathname === "/dashboard/business/retail/owner/transfer",
          },
        ],
      },
      {
        title: t.management.title,
        url: "#",
        icon: Users,
        isActive:
          pathname.includes("/dashboard/business/retail/owner/locations") ||
          pathname.includes("/dashboard/business/retail/owner/employees") ||
          pathname.includes("/dashboard/business/retail/owner/users"),
        defaultOpen: true,
        items: [
          {
            title: t.management.locations,
            url: "/dashboard/business/retail/owner/locations",
            isActive: pathname === "/dashboard/business/retail/owner/locations",
          },
          {
            title: t.management.employees,
            url: "/dashboard/business/retail/owner/employees",
            isActive: pathname === "/dashboard/business/retail/owner/employees",
          },
          {
            title: t.management.users,
            url: "/dashboard/business/retail/owner/users",
            isActive: pathname === "/dashboard/business/retail/owner/users",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}