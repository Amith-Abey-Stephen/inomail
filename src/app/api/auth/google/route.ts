import { NextResponse } from "next/server";

export async function GET() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const options = {
    redirect_uri: `${siteUrl}/api/auth/callback/google`,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };

  const qs = new URLSearchParams(options);

  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`);
}
