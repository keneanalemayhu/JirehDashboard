"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  Gauge,
  GalleryVerticalEnd,
  Settings2,
  Wrench,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/admin/AdminNavMain";
import { NavUser } from "@/components/dashboard/admin/AdminNavUser";
import { NavProjects } from "@/components/dashboard/admin/AdminNavProjects";
import { TeamSwitcher } from "@/components/dashboard/admin/AdminTeamSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      url: "/dashboard/admin",
    },
    {
      name: "Sales",
      logo: AudioWaveform,
      plan: "Revenue Operations",
      url: "/dashboard/sales",
    },
    {
      name: "Warehouse",
      logo: Command,
      plan: "Inventory Management",
      url: "/dashboard/warehouse",
    },
  ],
  projects: [
    {
      name: "Overview",
      url: "/dashboard/admin/",
      icon: Gauge,
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
          url: "/dashboard/admin/locations",
        },
        {
          title: "Categories",
          url: "/dashboard/admin/categories",
        },
        {
          title: "Items",
          url: "/dashboard/admin/items",
        },
        {
          title: "Employees",
          url: "/dashboard/admin/employees",
        },
        {
          title: "Users",
          url: "/dashboard/admin/users",
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
          url: "/dashboard/admin/profile",
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
