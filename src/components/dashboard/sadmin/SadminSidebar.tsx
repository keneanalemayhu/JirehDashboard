"use client";

import * as React from "react";
import { Gauge, Crown, CreditCard, Store, Settings2 } from "lucide-react";

import { NavMain } from "@/components/dashboard/sadmin/SadminNavMain";
import { NavUser } from "@/components/dashboard/sadmin/SadminNavUser";
import { NavProjects } from "@/components/dashboard/sadmin/SadminNavProjects";
import { TeamSwitcher } from "@/components/dashboard/sadmin/SadminTeamSwitcher";
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
      name: "Super Admin",
      logo: Crown,
      plan: "One dashboard to rule them all",
      url: "/dashboard/sadmin",
    },
  ],
  projects: [
    {
      name: "Overview",
      url: "/dashboard/sadmin/",
      icon: Gauge,
    },
    {
      name: "Subscribed users",
      url: "/dashboard/sadmin/subscriptions",
      icon: CreditCard,
    },
  ],
  navMain: [
    {
      title: "Stores",
      url: "",
      icon: Store,
      isActive: true,
      items: [
        {
          title: "Locations",
          url: "/dashboard/sadmin/stores/locations",
        },
        {
          title: "Categories",
          url: "/dashboard/sadmin/stores/categories",
        },
        {
          title: "Items",
          url: "/dashboard/sadmin/stores/items",
        },
        {
          title: "Employees",
          url: "/dashboard/sadmin/stores/employees",
        },
        {
          title: "Users",
          url: "/dashboard/sadmin/stores/users",
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
