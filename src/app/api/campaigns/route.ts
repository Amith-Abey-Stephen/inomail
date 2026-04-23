import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Campaign from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token) as UserPayload;
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    await connectDB();

    let query: any = { organizationId: user.organizationId };
    
    // If status is provided (e.g., Drafts), filter by it.
    // If not, show all non-Draft campaigns (History).
    if (status) {
      query.status = status;
    } else {
      query.status = { $ne: "Draft" };
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ campaigns }, { status: 200 });

  } catch (error: any) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
