"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname || "";

    // Root and auth redirects
    if (path === "/" || path === "") {
      router.push("/auth/login");
      return;
    }

    if (path === "/auth" || path === "/auth/") {
      router.push("/auth/login");
      return;
    }

    // Handle unauthorized paths
    if (path === "/dashboard/business" || path === "/dashboard/business/") {
      router.push("/auth/login");
      return;
    }

    // Handle role-specific redirects
    const roleRedirects: Record<string, string> = {
      "/dashboard/business/owner": "/dashboard/business/owner/overview",
      "/dashboard/business/owner/": "/dashboard/business/owner/overview",
      "/dashboard/business/admin": "/dashboard/business/admin/overview",
      "/dashboard/business/admin/": "/dashboard/business/admin/overview",
      "/dashboard/business/sales": "/dashboard/business/sales/orders",
      "/dashboard/business/sales/": "/dashboard/business/sales/orders",
      "/dashboard/business/warehouse": "/dashboard/business/warehouse/items",
      "/dashboard/business/warehouse/": "/dashboard/business/warehouse/items",
    };

    // Handle settings redirects
    const settingsRedirects: Record<string, string> = {
      "/dashboard/business/owner/settings":
        "/dashboard/business/owner/settings/profile",
      "/dashboard/business/owner/settings/":
        "/dashboard/business/owner/settings/profile",
      "/dashboard/business/admin/settings":
        "/dashboard/business/admin/settings/profile",
      "/dashboard/business/admin/settings/":
        "/dashboard/business/admin/settings/profile",
      "/dashboard/business/sales/settings":
        "/dashboard/business/sales/settings/profile",
      "/dashboard/business/sales/settings/":
        "/dashboard/business/sales/settings/profile",
      "/dashboard/business/warehouse/settings":
        "/dashboard/business/warehouse/settings/profile",
      "/dashboard/business/warehouse/settings/":
        "/dashboard/business/warehouse/settings/profile",
    };

    if (roleRedirects[path]) {
      router.push(roleRedirects[path]);
    } else if (settingsRedirects[path]) {
      router.push(settingsRedirects[path]);
    } else {
      // If not a special case, try to serve the page
      router.push(path);
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}