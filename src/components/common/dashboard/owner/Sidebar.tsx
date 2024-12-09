// components/common/dashboard/owner/Sidebar.tsx
"use client";

import * as React from "react";
import { AppSidebar } from "@/components/dashboard/owner/OwnerSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
