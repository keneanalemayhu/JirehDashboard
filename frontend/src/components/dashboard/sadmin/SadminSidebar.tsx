"use client";

import * as React from "react";
import {
  Crown,
  Gauge,
  Store,
  Computer,
} from "lucide-react";
import { NavMain } from "@/components/dashboard/sadmin/SadminNavMain";
import { NavUser } from "@/components/dashboard/sadmin/SadminNavUser";
import { TeamSwitcher } from "@/components/dashboard/sadmin/SadminTeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/sadmin";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { language } = useLanguage();
  const t = translations[language].dashboard.sadmin.sidebar;

  // This is sample data with translations
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
    navMain: [
      {
        title: "Overview",
        url: "",
        icon: Gauge,
        isActive: true,
        items: [
          {
            title: "Dashboard",
            url: "/dashboard/sadmin",
          },
          {
            title: "Activity Log",
            url: "/dashboard/sadmin/stores/activity-log",
          },
        ],
      },

      {
        title: "Stores",
        url: "",
        icon: Store,
        isActive: true,
        items: [
          {
            title: "All Stores",
            url: "/dashboard/sadmin/stores/stores",
          },
          {
            title: "Subscriptions",
            url: "/dashboard/sadmin/stores/subscriptions",
          },
          {
            title: "Store Analysis",
            url: "/dashboard/sadmin/stores/store-analysis",
          },
        ],
      },

      {
        title: "Platform",
        url: "",
        icon: Computer,
        isActive: true,
        items: [
          {
            title: "System Settings",
            url: "/dashboard/sadmin/stores/system-settings",
          },
          {
            title: "User Management",
            url: "/dashboard/sadmin/stores/user-mgn",
          },
          {
            title: "Billing & Payments",
            url: "/dashboard/sadmin/stores/billings-payments",
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
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
