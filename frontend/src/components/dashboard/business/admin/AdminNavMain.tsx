"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

interface SubItem {
  title: string;
  url: string;
  isActive?: boolean;
  disabled?: boolean;
}

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  defaultOpen?: boolean;
  items?: SubItem[];
}

interface NavMainProps {
  items: NavItem[];
}

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.defaultOpen}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={item.isActive ? "text-primary" : ""}
                >
                  {item.icon && (
                    <item.icon
                      className={item.isActive ? "text-primary" : ""}
                    />
                  )}
                  <span>{item.title}</span>
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                      item.isActive ? "text-primary" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      {subItem.disabled ? (
                        <div className="flex items-center px-4 py-2 opacity-50 cursor-not-allowed">
                          <span>{subItem.title}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Coming soon)
                          </span>
                        </div>
                      ) : (
                        <SidebarMenuSubButton
                          asChild
                          className={
                            subItem.isActive
                              ? "text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-primary before:rounded-r-full"
                              : ""
                          }
                        >
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      )}
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
