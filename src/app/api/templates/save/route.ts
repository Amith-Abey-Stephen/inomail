import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, UserPayload } from "@/lib/auth";
import connectDB from "@/lib/db/connect";
import Template from "@/models/Template";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token) as UserPayload;
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, htmlContent, category = "General" } = await req.json();

    if (!name || !htmlContent) {
      return NextResponse.json({ error: "Name and HTML content are required" }, { status: 400 });
    }

    await connectDB();

    const template = await Template.create({
      organizationId: user.organizationId,
      userId: user.userId,
      name,
      htmlContent,
      category
    });

    return NextResponse.json({ 
      message: "Template saved successfully",
      templateId: template._id 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Save template error:", error);
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 });
  }
}
