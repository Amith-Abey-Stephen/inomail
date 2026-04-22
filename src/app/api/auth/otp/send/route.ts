import { NextResponse } from "next/server";
import { Resend } from "resend";
import connectDB from "@/lib/db/connect";
import { redis } from "@/lib/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Redis with 10 min expiry
    // If Redis is not available, I'll need a fallback. Let's check src/lib/redis
    if (redis) {
      await redis.set(`otp:${email}`, otp, "EX", 600);
    } else {
      // Fallback if no redis (for now, maybe a global variable or just error out)
      return NextResponse.json({ error: "OTP storage not configured" }, { status: 500 });
    }

    // Send Email
    await resend.emails.send({
      from: "InoMail <onboarding@resend.dev>", // Should be verified domain later
      to: email,
      subject: "Your Verification Code - InoMail",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Verify your account</h2>
          <p>Your verification code for InoMail is:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #6366f1; padding: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("OTP Send Error:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}
