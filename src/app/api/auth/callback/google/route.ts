import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { signToken } from "@/lib/auth";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=No code provided", req.url));
  }

  try {
    await connectDB();

    // 1. Exchange code for tokens
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${siteUrl}/api/auth/callback/google`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();
    if (tokens.error) {
      console.error("Token error:", tokens);
      return NextResponse.redirect(new URL("/login?error=Failed to exchange code", req.url));
    }

    // 2. Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();
    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login?error=No email returned from Google", req.url));
    }

    // 3. Check if User exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // NEW USER FLOW: Don't create yet, just redirect back to signup with details
      const signupUrl = new URL("/signup", req.url);
      signupUrl.searchParams.set("step", "1");
      signupUrl.searchParams.set("provider", "google");
      signupUrl.searchParams.set("email", googleUser.email);
      signupUrl.searchParams.set("name", googleUser.name);
      
      return NextResponse.redirect(signupUrl);
    }

    // EXISTING USER FLOW: Log them in
    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    const response = NextResponse.redirect(new URL("/admin/dashboard", req.url));

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google Auth Callback Error:", error);
    return NextResponse.redirect(new URL("/login?error=Internal server error", req.url));
  }
}
