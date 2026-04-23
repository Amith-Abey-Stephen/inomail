import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/connect";
import Organization from "@/models/Organization";
import User from "@/models/User";
import { verifyToken, signToken } from "@/lib/auth";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    // 1. Find all organizations where the user is a member to determine their "highest" plan
    const userOrgs = await Organization.find({ members: payload.userId });
    const userOrgsCount = userOrgs.length;

    // 2. Determine the creation limit based on the best plan the user has access to
    const hasEnterprise = userOrgs.some(org => org.plan === "Enterprise");
    const hasPro = userOrgs.some(org => org.plan === "Pro");

    let limit = 1; // Default for Starter
    let planName = "Starter";

    if (hasEnterprise) {
      limit = 50;
      planName = "Enterprise";
    } else if (hasPro) {
      limit = 5;
      planName = "Pro";
    }

    if (userOrgsCount >= limit) {
      return NextResponse.json({ 
        error: `Your current ${planName} plan allows a maximum of ${limit} organization(s). Please upgrade to create more.` 
      }, { status: 403 });
    }

    // 3. Handle slug uniqueness
    let baseSlug = generateSlug(name);
    let slug = baseSlug;
    let count = 1;
    while (await Organization.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    // 4. Create Organization (New orgs start on Starter by default)
    const organization = await Organization.create({
      name,
      slug,
      plan: "Starter",
      rateLimit: {
        maxEmailsPerDay: 100,
        maxMembers: 1,
      },
      members: [payload.userId],
    });

    // 5. Update User's active organizationId to the new one
    await User.findByIdAndUpdate(payload.userId, { organizationId: organization._id });

    // 6. Generate new token
    const newToken = signToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      organizationId: organization._id,
    });

    const response = NextResponse.json({ 
      message: "Organization created successfully", 
      organization 
    }, { status: 201 });

    response.cookies.set("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Create Org Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
