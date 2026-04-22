import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isDashboard = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/member") || request.nextUrl.pathname.startsWith("/superadmin");
  const isAuthPage = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";

  // If trying to access dashboard without a token, redirect to login
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If trying to access auth pages with a token, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url)); // Default redirect
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*", "/superadmin/:path*", "/login", "/signup"],
};
