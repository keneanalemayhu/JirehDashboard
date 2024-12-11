import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/common/dashboard/business/retail/warehouse/Header";
import { SidebarLayout } from "@/components/common/dashboard/business/retail/warehouse/Sidebar";
import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout>
      <Header />
      <div className="flex-1 space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" asChild>
              <Link href="./profile">Profile</Link>
            </TabsTrigger>
            <TabsTrigger value="account" asChild>
              <Link href="./account">Account</Link>
            </TabsTrigger>
          </TabsList>
          {children}
        </Tabs>
      </div>
    </SidebarLayout>
  );
}
