import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

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

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenRouter API Key is not configured." }, { status: 500 });
    }

    // 2. Parse Request
    const { prompt, tone = "professional", variables = [] } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 3. Construct Prompt
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

    // 4. Generate Content using OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "InoMail",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct", // High performance Llama 3.3 model
        messages: [
          { role: "system", content: "You are a specialized HTML email template generator." },
          { role: "user", content: structuredPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return NextResponse.json({ error: data.error.message || "Failed to generate email" }, { status: 500 });
    }

    let htmlContent = data.choices[0].message.content;

    // 5. Clean up markdown artifacts if the model disobeys
    htmlContent = htmlContent.replace(/^```html\s*/, "").replace(/\s*```$/, "");

    return NextResponse.json({ html: htmlContent }, { status: 200 });

  } catch (error: any) {
    console.error("Email generation error:", error);
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
  }
}
