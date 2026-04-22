import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { verifyToken } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const groupName = formData.get("groupName") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using a stream
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `inomail/${user.organizationId}/${groupName || 'general'}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ 
      url: uploadResult.secure_url, 
      name: file.name,
      format: uploadResult.format 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload asset" }, { status: 500 });
  }
}
