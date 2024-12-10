"use client";

import * as React from "react";
import { AudioWaveform, Gauge, ArrowUpDown, CirclePlus } from "lucide-react";

import { NavUser } from "@/components/dashboard/business/retail/sales/SalesNavUser";
import { NavProjects } from "@/components/dashboard/business/retail/sales/SalesNavProjects";
import { TeamSwitcher } from "@/components/dashboard/business/retail/sales/SalesTeamSwitcher";
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
      name: "Sales",
      logo: AudioWaveform,
      plan: "Revenue Operations",
      url: "/dashboard/sales",
    },
  ],
  projects: [
    {
      name: "Overview",
      url: "/dashboard/sales/",
      icon: Gauge,
    },
    {
      name: "Orders",
      url: "/dashboard/sales/orders",
      icon: ArrowUpDown,
    },
    {
      name: "Order New",
      url: "/dashboard/sales/order",
      icon: CirclePlus,
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
