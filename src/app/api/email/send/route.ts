import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Campaign from "@/models/Campaign";
import { addEmailsToQueue } from "@/lib/queue/producer";

export async function POST(req: Request) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, subject, htmlContent, recipients, scheduledAt } = await req.json();

    if (!subject || !htmlContent || !recipients || recipients.length === 0) {
      return NextResponse.json({ error: "Missing required campaign data" }, { status: 400 });
    }

    await connectDB();

    // Create Campaign Draft
    const campaign = await Campaign.create({
      organizationId: user.organizationId,
      userId: user.userId,
      name: name || `Campaign - ${new Date().toLocaleDateString()}`,
      subject,
      htmlContent,
      status: scheduledAt ? "Draft" : "Queued",
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      "stats.total": recipients.length,
    });

    if (!scheduledAt) {
      // Dispatch immediately
      await addEmailsToQueue(
        campaign._id.toString(),
        user.organizationId,
        subject,
        htmlContent,
        recipients
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Campaign queued successfully",
      campaignId: campaign._id 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Send Campaign Error:", error);
    return NextResponse.json({ error: "Failed to queue campaign" }, { status: 500 });
  }
}
