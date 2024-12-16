// components/common/dashboard/owner/Sidebar.tsx
"use client";

import * as React from "react";
import { AppSidebar } from "@/components/dashboard/sadmin/SadminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { language } = useLanguage();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
