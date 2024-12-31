"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // Add this import
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  DollarSign,
  LayoutDashboard,
  Package,
  Users,
} from "lucide-react";
import { NavMain } from "@/components/dashboard/business/admin/AdminNavMain";
import { NavUser } from "@/components/dashboard/business/admin/AdminNavUser";
import { TeamSwitcher } from "@/components/dashboard/business/admin/AdminTeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/admin";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].dashboard.admin.sidebar;

  // This is sample data with translations
  const data = {
    user: {
      name: "Abebe",
      email: "abebe@example.com",
      avatar: "/public/avatar/avatar.png",
    },
    teams: [
      {
        name: t.teams.admin,
        logo: GalleryVerticalEnd,
        plan: t.teams.adminPlan,
        url: "/dashboard/business/admin",
      },
      {
        name: t.teams.sales,
        logo: AudioWaveform,
        plan: t.teams.salesPlan,
        url: "/dashboard/business/sales",
      },
      {
        name: t.teams.warehouse,
        logo: Command,
        plan: t.teams.warehousePlan,
        url: "/dashboard/business/warehouse",
      },
    ],
    navMain: [
      {
        title: t.dashboard.title,
        url: "#",
        icon: LayoutDashboard,
        isActive: pathname.startsWith("/dashboard/business/admin"),
        defaultOpen: true,
        items: [
          {
            title: t.dashboard.overview,
            url: "/dashboard/business/admin/overview",
            isActive: pathname === "/dashboard/business/admin/overview",
          },
        ],
      },
      {
        title: t.sales_profit.title,
        url: "#",
        icon: DollarSign,
        isActive:
          pathname.includes("/dashboard/business/admin/orders") ||
          pathname.includes("/dashboard/business/admin/expenses"),
        defaultOpen: true,
        items: [
          {
            title: t.sales_profit.orders,
            url: "/dashboard/business/admin/orders",
            isActive: pathname === "/dashboard/business/admin/orders",
          },
          {
            title: t.sales_profit.expenses,
            url: "/dashboard/business/admin/expenses",
            isActive: pathname === "/dashboard/business/admin/expenses",
          },
        ],
      },
      {
        title: t.inventory.title,
        url: "#",
        icon: Package,
        isActive:
          pathname.includes("/dashboard/business/admin/items") ||
          pathname.includes("/dashboard/business/admin/categories") ||
          pathname.includes("/dashboard/business/admin/transfer"),
        defaultOpen: true,
        items: [
          {
            title: t.inventory.items,
            url: "/dashboard/business/admin/items",
            isActive: pathname === "/dashboard/business/admin/items",
          },
          {
            title: t.inventory.categories,
            url: "/dashboard/business/admin/categories",
            isActive: pathname === "/dashboard/business/admin/categories",
          },
        ],
      },
      {
        title: t.management.title,
        url: "#",
        icon: Users,
        isActive:
          pathname.includes("/dashboard/business/admin/locations") ||
          pathname.includes("/dashboard/business/admin/employees") ||
          pathname.includes("/dashboard/business/admin/users"),
        defaultOpen: true,
        items: [
          {
            title: t.management.locations,
            url: "/dashboard/business/admin/locations",
            isActive: pathname === "/dashboard/business/admin/locations",
          },
          {
            title: t.management.employees,
            url: "/dashboard/business/admin/employees",
            isActive: pathname === "/dashboard/business/admin/employees",
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
