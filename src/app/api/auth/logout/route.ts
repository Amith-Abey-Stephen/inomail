import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectPath = searchParams.get("redirect") || "/login";
  
  const response = NextResponse.redirect(new URL(redirectPath, req.url));
  
  // Clear the token cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  
  return response;
}
