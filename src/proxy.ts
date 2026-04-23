import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_key_change_in_production"
);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Route Protection
  const isAuthRoute = pathname === "/login" || pathname === "/signup";
  const isProtectedRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  // 2. Handle Authentication
  if (isProtectedRoute || (isApiRoute && !isAuthRoute)) {
    if (!token) {
      if (isApiRoute) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      console.error("Middleware Auth Error:", err);
      if (isApiRoute) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // 3. Prevent logged-in users from visiting login/signup
  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } catch (err) {
      // Invalid token, allow login
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/login",
    "/signup",
  ],
};
