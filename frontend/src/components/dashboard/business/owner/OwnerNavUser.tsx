"use client";

import Link from "next/link";
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
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLanguage } from "@/components/context/LanguageContext";
import { translations } from "@/translations/dashboard/business/owner";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { fetchProfileData, updateProfileData } from "@/lib/api/profile";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { language } = useLanguage();
  const t = translations[language].dashboard.owner.sidebar.userMenu;
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; avatar: string | null }>({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfileData();
        setUser({
          name: data.username,
          email: data.email,
          avatar: data.avatar,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear(); // Clear tokens and user data
      router.push("/auth/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const defaultAvatar = "/api/placeholder/32/32";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">
                  <img
                    src="/avatar/steve.png"
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar || defaultAvatar}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    <img
                      src="/avatar/steve.png"
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard/business/owner/settings" passHref>
                <DropdownMenuItem asChild>
                  <span>
                    <User className="mr-2 h-4 w-4" />
                    {t.account}
                  </span>
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
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
