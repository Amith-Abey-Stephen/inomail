import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import Campaign from "@/models/Campaign";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // 1. Auth & Validation
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token) as UserPayload;
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, subject, htmlContent, recipients, assets } = await req.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json({ error: "No recipients provided" }, { status: 400 });
    }

    await connectDB();
    const org = await Organization.findById(user.organizationId);
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    // 2. Setup Transporter
    const config = org.emailConfig;
    if (!config || (!config.appPassword && !config.smtpPass)) {
      return NextResponse.json({ error: "Email delivery not configured. Please visit Settings." }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: config.smtpHost || "smtp.gmail.com",
      port: config.smtpPort || 465,
      secure: config.smtpPort === 465 || !config.smtpPort,
      auth: {
        user: config.email,
        pass: config.appPassword || config.smtpPass,
      },
    });

    // 3. Initialize Results
    const successRecipients: any[] = [];
    const failedRecipients: any[] = [];
    let sentCount = 0;
    let failedCount = 0;

    // 4. Batch Processing (Sequential for now to ensure stability in serverless)
    for (const recipient of recipients) {
      try {
        // Variable Injection
        let personalizedHtml = htmlContent;
        Object.entries(recipient).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, "gi");
          personalizedHtml = personalizedHtml.replace(regex, String(value));
        });

        // Send
        await transporter.sendMail({
          from: `"${org.name}" <${config.email}>`,
          to: recipient.Email || recipient.email || recipient.EMAIL,
          subject: subject,
          html: personalizedHtml,
        });

        successRecipients.push(recipient);
        sentCount++;
      } catch (err: any) {
        console.error(`Failed to send to ${recipient.Email}:`, err.message);
        failedRecipients.push({ ...recipient, error: err.message });
        failedCount++;
      }
    }

    // 5. Save Campaign History
    const campaign = await Campaign.create({
      organizationId: user.organizationId,
      userId: user.userId,
      name,
      subject,
      htmlContent,
      status: "Completed",
      stats: {
        total: recipients.length,
        sent: sentCount,
        failed: failedCount,
      },
      recipients,
      successRecipients,
      failedRecipients,
      assets
    });

    return NextResponse.json({ 
      message: "Campaign completed",
      campaignId: campaign._id,
      stats: campaign.stats,
      failedRecipients 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Launch error:", error);
    return NextResponse.json({ error: error.message || "Launch failed" }, { status: 500 });
  }
}
