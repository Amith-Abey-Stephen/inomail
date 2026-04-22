import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { organizationName, plan = "Starter" } = await req.json();

    if (!organizationName) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    // 1. Get user from token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as any;
    const userId = payload.userId;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Update Organization
    const organization = await Organization.findById(user.organizationId);
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    organization.name = organizationName;
    organization.plan = plan;
    organization.rateLimit = {
      maxEmailsPerDay: plan === "Starter" ? 100 : plan === "Pro" ? 10000 : 999999,
      maxMembers: plan === "Starter" ? 1 : plan === "Pro" ? 10 : 999,
    };

    await organization.save();

    return NextResponse.json({ message: "Setup completed successfully", organization });
  } catch (error: any) {
    console.error("Complete Setup Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
