import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectPath = searchParams.get("redirect") || "/login";
  
  const response = NextResponse.redirect(new URL(redirectPath, req.url));
  
  // Clear the token cookie
  response.cookies.delete("token");
  response.cookies.delete("user");
  
  return response;
}
