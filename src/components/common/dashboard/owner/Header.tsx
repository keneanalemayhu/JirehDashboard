// components/common/dashboard/owner/Header.tsx
"use client";

import * as React from "react";
import { NavActions } from "@/components/dashboard/owner/OwnerNavAction";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/owner/index";

export function Header() {
  const { language } = useLanguage();
  const t = translations[language].dashboard.owner.header;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <p>
          <b>{t.title}</b>
        </p>
      </div>
      <div className="ml-auto px-3">
        <NavActions />
      </div>
    </header>
  );
}
