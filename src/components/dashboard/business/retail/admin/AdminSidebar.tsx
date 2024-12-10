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
} from "lucide-react";

import { NavMain } from "@/components/dashboard/business/retail/admin/AdminNavMain";
import { NavUser } from "@/components/dashboard/business/retail/admin/AdminNavUser";
import { NavProjects } from "@/components/dashboard/business/retail/admin/AdminNavProjects";
import { TeamSwitcher } from "@/components/dashboard/business/retail/admin/AdminTeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Admin",
      logo: GalleryVerticalEnd,
      plan: "Management",
      url: "/dashboard/business/retail/admin",
    },
    {
      name: "Sales",
      logo: AudioWaveform,
      plan: "Revenue Operations",
      url: "/dashboard/business/retail/sales",
    },
    {
      name: "Warehouse",
      logo: Command,
      plan: "Inventory Management",
      url: "/dashboard/business/retail/warehouse",
    },
  ],
  projects: [
    {
      name: "Overview",
      url: "/dashboard/business/retail/admin/",
      icon: Gauge,
    },
    {
      name: "Orders",
      url: "/dashboard/business/retail/admin/orders",
      icon: ListOrdered,
    },
  ],
  navMain: [
    {
      title: "Manage",
      url: "#",
      icon: Wrench,
      isActive: true,
      items: [
        {
          title: "Locations",
          url: "/dashboard/business/retail/admin/locations",
        },
        {
          title: "Categories",
          url: "/dashboard/business/retail/admin/categories",
        },
        {
          title: "Items",
          url: "/dashboard/business/retail/admin/items",
        },
        {
          title: "Employees",
          url: "/dashboard/business/retail/admin/employees",
        },
        {
          title: "Users",
          url: "/dashboard/business/retail/admin/users",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      isactive: true,
      items: [
        {
          title: "Profile",
          url: "/dashboard/business/retail/admin/profile",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
