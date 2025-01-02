"use client";

import Link from "next/link";
import { memo } from 'react';
import { ChevronsUpDown, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/owner";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useProfile } from "@/components/context/ProfileContext";
import { useCallback } from "react";
import { toast } from "sonner";

interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
}

const NavUserContent = memo(function NavUserContent({ 
  user, 
  t, 
  handleLogout 
}: { 
  user: UserProfile; 
  t: any;
  handleLogout: () => void;
}) {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="w-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ""} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isMobile && (
            <div className="ml-3 text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
          <ChevronsUpDown className="ml-auto h-4 w-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/business/owner/settings">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {t.account}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          {t.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export interface NavUserProps {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user: externalUser }: NavUserProps) {
  const { language } = useLanguage();
  const t = translations[language].dashboard.owner.sidebar.userMenu;
  const { logout } = useAuth();
  const router = useRouter();
  const { profile, isLoading } = useProfile();

  const user: UserProfile = externalUser || {
    name: profile?.username || "",
    email: profile?.email || "",
    avatar: profile?.avatar || null,
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    }
  }, [logout, router]);

  if (isLoading && !externalUser) {
    return (
      <SidebarMenu>
        <SidebarMenuButton className="w-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>...</AvatarFallback>
          </Avatar>
        </SidebarMenuButton>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <NavUserContent user={user} t={t} handleLogout={handleLogout} />
    </SidebarMenu>
  );
}
