"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  Gauge,
  GalleryVerticalEnd,
  Settings2,
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
        url: "/dashboard/owner",
      },
      {
        name: t.teams.admin,
        logo: GalleryVerticalEnd,
        plan: t.teams.adminPlan,
        url: "/dashboard/admin",
      },
      {
        name: t.teams.sales,
        logo: AudioWaveform,
        plan: t.teams.salesPlan,
        url: "/dashboard/sales",
      },
      {
        name: t.teams.warehouse,
        logo: Command,
        plan: t.teams.warehousePlan,
        url: "/dashboard/warehouse",
      },
    ],
    projects: [
      {
        name: t.projects.overview,
        url: "/dashboard/owner/",
        icon: Gauge,
      },
      {
        name: t.projects.orders,
        url: "/dashboard/owner/orders",
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
            url: "/dashboard/owner/locations",
          },
          {
            title: t.manage.categories,
            url: "/dashboard/owner/categories",
          },
          {
            title: t.manage.items,
            url: "/dashboard/owner/items",
          },
          {
            title: t.manage.employees,
            url: "/dashboard/owner/employees",
          },
          {
            title: t.manage.users,
            url: "/dashboard/owner/users",
          },
        ],
      },
      {
        title: t.settingsSection.title,
        url: "#",
        icon: Settings2,
        isactive: true,
        items: [
          {
            title: t.settingsSection.profile,
            url: "/dashboard/owner/profile",
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
