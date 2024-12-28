"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Gauge,
  Wrench,
  ListOrdered,
  BookUser,
} from "lucide-react";
import { NavMain } from "@/components/dashboard/business/admin/AdminNavMain";
import { NavUser } from "@/components/dashboard/business/admin/AdminNavUser";
import { NavProjects } from "@/components/dashboard/business/admin/AdminNavProjects";
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
        logo: BookUser,
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
    projects: [
      {
        name: t.projects.overview,
        url: "/dashboard/business/admin/",
        icon: Gauge,
      },
      {
        name: t.projects.orders,
        url: "/dashboard/business/admin/orders",
        icon: ListOrdered,
      },
    ],
    navMain: [
      {
        title: t.manage.title,
        url: "#",
        icon: Wrench,
        isActive: true,
        items: [
          {
            title: t.manage.locations,
            url: "/dashboard/business/admin/locations",
          },
          {
            title: t.manage.categories,
            url: "/dashboard/business/admin/categories",
          },
          {
            title: t.manage.items,
            url: "/dashboard/business/admin/items",
          },
          {
            title: t.manage.employees,
            url: "/dashboard/business/admin/employees",
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
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
