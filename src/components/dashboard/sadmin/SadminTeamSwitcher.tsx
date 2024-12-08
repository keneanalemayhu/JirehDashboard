"use client";

import * as React from "react";
import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
    url: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          href={activeTeam.url}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={() => setActiveTeam(activeTeam)}
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <activeTeam.logo className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{activeTeam.name}</span>
            <span className="truncate text-xs">{activeTeam.plan}</span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
