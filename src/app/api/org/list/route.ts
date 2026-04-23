import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
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

    // Find all organizations where the user is a member
    const organizations = await Organization.find({
      members: payload.userId,
    }).select("name slug _id plan");

    return NextResponse.json({ 
      organizations, 
      activeOrganizationId: payload.organizationId 
    });
  } catch (error: any) {
    console.error("List Orgs Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
