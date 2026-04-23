import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Campaign from "@/models/Campaign";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token) as UserPayload;
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, subject, htmlContent, assets = [] } = await req.json();

    if (!name || !htmlContent) {
      return NextResponse.json({ error: "Name and HTML content are required" }, { status: 400 });
    }

    await connectDB();

    const campaign = await Campaign.create({
      organizationId: user.organizationId,
      userId: user.userId,
      name,
      subject: subject || "No Subject",
      htmlContent,
      status: "Draft",
      assets,
      stats: { total: 0, sent: 0, failed: 0, opened: 0, clicked: 0, bounced: 0 }
    });

    return NextResponse.json({ 
      message: "Draft saved successfully",
      campaignId: campaign._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Save draft error:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}
