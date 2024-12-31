import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Root redirects
  if (path === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Auth redirects
  if (path === "/auth") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Dashboard redirects
  const dashboardRedirects: Record<string, string> = {
    "/dashboard/business/owner": "/dashboard/business/owner/overview",
    "/dashboard/business/admin": "/dashboard/business/admin/overview",
    "/dashboard/business/sales": "/dashboard/business/sales/orders",
    "/dashboard/business/warehouse": "/dashboard/business/warehouse/items",
  };

  if (dashboardRedirects[path]) {
    return NextResponse.redirect(
      new URL(dashboardRedirects[path], request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/dashboard/business/:path*"],
};