"use client"

import * as React from "react"
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

import { NavMain } from "@/components/dashboard/owner/OwnerNavMain";
import { NavUser } from "@/components/dashboard/owner/OwnerNavUser";
import { NavProjects } from "@/components/dashboard/owner/OwnerNavProjects";
import { TeamSwitcher } from "@/components/dashboard/owner/OwnerTeamSwitcher";
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
      name: "Owner",
      logo: BookUser,
      plan: "Management",
      url: "/dashboard/owner",
    },
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
      url: "/dashboard/owner/",
      icon: Gauge,
    },
    {
      name: "Orders",
      url: "/dashboard/owner/orders",
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
          url: "/dashboard/owner/locations",
        },
        {
          title: "Categories",
          url: "/dashboard/owner/categories",
        },
        {
          title: "Items",
          url: "/dashboard/owner/items",
        },
        {
          title: "Employees",
          url: "/dashboard/owner/employees",
        },
        {
          title: "Users",
          url: "/dashboard/owner/users",
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
          url: "/dashboard/owner/profile",
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
