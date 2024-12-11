// components/common/dashboard/admin/Sidebar.tsx
"use client";

import * as React from "react";
import { AppSidebar } from "@/components/dashboard/business/retail/admin/AdminSidebar";
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
