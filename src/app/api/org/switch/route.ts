import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/connect";
import User from "@/models/User";
import Organization from "@/models/Organization";
import { verifyToken, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { organizationId } = await req.json();
    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    // 1. Verify user is a member of the target organization
    const org = await Organization.findOne({
      _id: organizationId,
      members: payload.userId,
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 });
    }

    // 2. Update User's active organizationId
    await User.findByIdAndUpdate(payload.userId, { organizationId });

    // 3. Generate new token with updated organizationId
    const newToken = signToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role, // We might want to update role based on org membership in the future
      organizationId: organizationId,
    });

    // 4. Set new cookie
    const response = NextResponse.json({ message: "Switched organization successfully" });
    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Switch Org Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
