import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
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
You are an elite email copywriter and HTML developer. 
Create a premium, conversion-optimized HTML email based on:

Prompt: "${prompt}"
Tone: ${tone}
Variables: ${variables.length > 0 ? variables.map((v: string) => `{{${v}}}`).join(', ') : "None"}

Requirements:
1. Return ONLY raw HTML code (no markdown, no explanations).
2. Use a modern "card" layout with a subtle shadow and rounded corners.
3. Use a professional font stack (sans-serif).
4. Include a clear Call to Action (CTA) button with a vibrant background color.
5. Ensure 100% responsiveness using a fluid table-based layout.
6. Use high-contrast typography and plenty of whitespace.
7. Naturally integrate the provided variables using {{variable_name}}.
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
