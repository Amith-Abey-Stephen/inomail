import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password, organizationName, plan = "Starter" } = await req.json();

    if (!name || !email || !password || !organizationName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Handle org slug uniqueness
    let baseSlug = generateSlug(organizationName);
    let slug = baseSlug;
    let count = 1;
    while (await Organization.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // Create Organization
    const organization = await Organization.create({
      name: organizationName,
      slug,
      plan,
      rateLimit: {
        maxEmailsPerDay: plan === "Starter" ? 100 : plan === "Pro" ? 10000 : 999999,
        maxMembers: plan === "Starter" ? 1 : plan === "Pro" ? 10 : 999,
      }
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      organizationId: organization._id,
    });

    // Update Org with the new member
    organization.members.push(user._id);
    await organization.save();

    // Generate Token
    const token = signToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      organizationId: organization._id,
    });

    // Create response and set cookie
    const response = NextResponse.json(
      { message: "Account created successfully", user: { id: user._id, name, email, role: "Admin" }, organization },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
