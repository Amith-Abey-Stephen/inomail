import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key is not configured." }, { status: 500 });
    }

    // 2. Parse Request
    const { prompt, tone = "professional", variables = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 3. Initialize Gemini Model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 4. Construct Prompt
    const structuredPrompt = `
You are an expert email copywriter and HTML/CSS developer. 
Your task is to write a beautifully formatted, responsive HTML email based on the following instructions:

Prompt: "${prompt}"
Tone: ${tone}

Available dynamic variables that you CAN use in the email: ${variables.length > 0 ? variables.map((v: string) => `{{${v}}}`).join(', ') : "None"}

Requirements:
1. Return ONLY the raw HTML code (no markdown formatting, no \`\`\`html tags, no explanations).
2. The HTML must be fully inline-styled and responsive (table-based layout is safe for emails).
3. Ensure it looks professional, clean, and modern.
4. If there are variables provided, use them naturally in the copy using the {{variable_name}} syntax.
`;

    // 5. Generate Content
    const result = await model.generateContent(structuredPrompt);
    const response = await result.response;
    let htmlContent = response.text();

    // 6. Clean up markdown artifacts if the model disobeys
    htmlContent = htmlContent.replace(/^```html\s*/, "").replace(/\s*```$/, "");

    return NextResponse.json({ html: htmlContent }, { status: 200 });

  } catch (error: any) {
    console.error("Email generation error:", error);
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
  }
}
