import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const currentUser = verifyToken(token) as UserPayload;
    if (!currentUser || currentUser.role !== "Admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 403 });
    }

    const { name, email, password, role = "Member" } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // 2. Check org member limit
    const org = await Organization.findById(currentUser.organizationId);
    if (!org) return NextResponse.json({ error: "Organization not found" }, { status: 404 });

    if (org.members.length >= org.rateLimit.maxMembers) {
      return NextResponse.json({ error: "Organization member limit reached. Please upgrade your plan." }, { status: 400 });
    }

    // 3. Create user and associate with org
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      organizationId: org._id,
      role
    });

    // 4. Update org members list
    org.members.push(newUser._id);
    await org.save();

    return NextResponse.json({ 
      message: "Member added successfully",
      user: { id: newUser._id, name, email, role }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Add member error:", error);
    return NextResponse.json({ error: "Failed to add member" }, { status: 500 });
  }
}
