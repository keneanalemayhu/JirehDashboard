"use client";

import * as React from "react";
import { Gauge, CirclePlus, ListOrdered, Command } from "lucide-react";

import { NavUser } from "@/components/dashboard/business/sales/SalesNavUser";
import { NavProjects } from "@/components/dashboard/business/sales/SalesNavProjects";
import { TeamSwitcher } from "@/components/dashboard/business/sales/SalesTeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/sales";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { language } = useLanguage();
  const t = translations[language].dashboard.sales.sidebar;

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: t.teams.sales,
        logo: Command,
        plan: t.teams.salesPlan,
        url: "/dashboard/business/retail/sales",
      },
    ],
    projects: [
      {
        name: t.projects.overview,
        url: "/dashboard/business/retail/sales/",
        icon: Gauge,
      },
      {
        name: t.projects.newOrder,
        url: "/dashboard/business/retail/sales/new-order",
        icon: CirclePlus,
      },
      {
        name: t.projects.orders,
        url: "/dashboard/business/retail/sales/orders",
        icon: ListOrdered,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
