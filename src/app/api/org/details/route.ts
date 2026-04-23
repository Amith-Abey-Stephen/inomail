import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const currentUser = verifyToken(token) as UserPayload;
    if (!currentUser) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await connectDB();

    const org = await Organization.findById(currentUser.organizationId).populate({
      path: 'members',
      select: 'name email role _id'
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      organization: {
        id: org._id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
        createdAt: org.createdAt,
        memberCount: org.members.length,
        maxMembers: org.rateLimit.maxMembers
      },
      members: org.members
    }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch org details error:", error);
    return NextResponse.json({ error: "Failed to fetch organization details" }, { status: 500 });
  }
}
