import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Template from "@/models/Template";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token) as UserPayload;
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await connectDB();

    const templates = await Template.find({ organizationId: user.organizationId }).sort({ createdAt: -1 });

    return NextResponse.json({ templates }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch templates error:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
  }
}
