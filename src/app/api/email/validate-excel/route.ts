import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as xlsx from "xlsx";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No Excel file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Read workbook
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Parse to JSON
    const rawData = xlsx.utils.sheet_to_json(sheet) as Record<string, any>[];

    if (rawData.length === 0) {
      return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });
    }

    // Identify columns mapping (case-insensitive)
    const columns = Object.keys(rawData[0]);
    const emailCol = columns.find(c => c.toLowerCase() === "email");
    const nameCol = columns.find(c => c.toLowerCase() === "name");

    if (!emailCol || !nameCol) {
      return NextResponse.json({ 
        error: "Missing required columns. Excel must have 'Email' and 'Name' columns." 
      }, { status: 400 });
    }

    // Row-by-row validation
    let validCount = 0;
    let invalidRows: { row: number; reason: string }[] = [];
    const validData: any[] = [];

    rawData.forEach((row, index) => {
      const email = row[emailCol];
      const name = row[nameCol];

      if (!email || !String(email).includes("@")) {
        invalidRows.push({ row: index + 2, reason: "Invalid or missing Email" });
      } else if (!name) {
        invalidRows.push({ row: index + 2, reason: "Missing Name" });
      } else {
        // Normalize keys
        const cleanRow: any = { Email: email, Name: name };
        
        // Include any custom variables (like asset1, company, etc.)
        columns.forEach(col => {
          if (col !== emailCol && col !== nameCol) {
            cleanRow[col.toLowerCase()] = row[col];
          }
        });

        validData.push(cleanRow);
        validCount++;
      }
    });

    return NextResponse.json({
      success: true,
      totalRows: rawData.length,
      validCount,
      invalidCount: invalidRows.length,
      invalidRows: invalidRows.slice(0, 10), // Send max 10 errors to UI
      data: validData.slice(0, 5), // Send sample data for preview
      variables: columns.map(c => c.toLowerCase()),
    }, { status: 200 });

  } catch (error: any) {
    console.error("Excel validation error:", error);
    return NextResponse.json({ error: "Failed to parse Excel file" }, { status: 500 });
  }
}
