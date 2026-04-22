import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature || !process.env.RAZORPAY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    await connectDB();

    // Handle Payment Success Event
    if (event.event === "payment.captured") {
      const { email } = event.payload.payment.entity;
      // In a real scenario, you'd link this via a subscription ID or customer ID
      // Here we just find an org by member email (simplified)
      // await Organization.findOneAndUpdate(..., { plan: "Pro" });
      console.log("Payment successful for:", email);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
