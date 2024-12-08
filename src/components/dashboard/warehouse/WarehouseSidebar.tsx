"use client"

import * as React from "react"
import {
  Command,
  Gauge,
  ArrowUpDown,
  CirclePlus,
} from "lucide-react";

import { NavUser } from "@/components/dashboard/warehouse/WarehouseNavUser";
import { NavProjects } from "@/components/dashboard/warehouse/WarehouseNavProjects";
import { TeamSwitcher } from "@/components/dashboard/warehouse/WarehouseTeamSwitcher";
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
      name: "Warehouse",
      logo: Command,
      plan: "Inventory Management",
      url: "/dashboard/warehouse",
    },
  ],
  projects: [
    {
      name: "Overview",
      url: "/dashboard/warehouse/",
      icon: Gauge,
    },
    {
      name: "Items",
      url: "/dashboard/warehouse/items",
      icon: CirclePlus,
    },
    {
      name: "Orders",
      url: "/dashboard/warehouse/orders",
      icon: ArrowUpDown,
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
