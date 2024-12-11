"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Gauge,
  GalleryVerticalEnd,
  Wrench,
  ListOrdered,
  BookUser,
} from "lucide-react";
import { NavMain } from "@/components/dashboard/business/retail/owner/OwnerNavMain";
import { NavUser } from "@/components/dashboard/business/retail/owner/OwnerNavUser";
import { NavProjects } from "@/components/dashboard/business/retail/owner/OwnerNavProjects";
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
  const { language } = useLanguage();
  const t = translations[language].dashboard.owner.sidebar;

  // This is sample data with translations
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
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
    projects: [
      {
        name: t.projects.overview,
        url: "/dashboard/business/retail/owner/",
        icon: Gauge,
      },
      {
        name: t.projects.orders,
        url: "/dashboard/business/retail/owner/orders",
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
            url: "/dashboard/business/retail/owner/locations",
          },
          {
            title: t.manage.categories,
            url: "/dashboard/business/retail/owner/categories",
          },
          {
            title: t.manage.items,
            url: "/dashboard/business/retail/owner/items",
          },
          {
            title: t.manage.employees,
            url: "/dashboard/business/retail/owner/employees",
          },
          {
            title: t.manage.users,
            url: "/dashboard/business/retail/owner/users",
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
