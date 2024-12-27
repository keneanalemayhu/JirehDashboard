"use client";

import * as React from "react";
import { Gauge, CirclePlus, ListOrdered, Command } from "lucide-react";

import { NavUser } from "@/components/dashboard/business/warehouse/WarehouseNavUser";
import { NavProjects } from "@/components/dashboard/business/warehouse/WarehouseNavProjects";
import { TeamSwitcher } from "@/components/dashboard/business/warehouse/WarehouseTeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/warehouse";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { language } = useLanguage();
  const t = translations[language].dashboard.warehouse.sidebar;

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: t.teams.warehouse,
        logo: Command,
        plan: t.teams.warehousePlan,
        url: "/dashboard/business/retail/warehouse",
      },
    ],
    projects: [
      {
        name: t.projects.overview,
        url: "/dashboard/business/retail/warehouse/",
        icon: Gauge,
      },
      {
        name: t.projects.items,
        url: "/dashboard/business/retail/warehouse/items",
        icon: CirclePlus,
      },
      {
        name: t.projects.orders,
        url: "/dashboard/business/retail/warehouse/orders",
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
