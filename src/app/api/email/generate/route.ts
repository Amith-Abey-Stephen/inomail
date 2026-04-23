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
You are a world-class HTML email developer specializing in **Legacy Table-Based Layouts** for 100% alignment stability across all clients (Outlook, Gmail, Apple Mail).
Create a stunning, high-end "WOW" factor email template using bulletproof email coding techniques.

Aesthetic Categories (Choose one):
- **Midnight Neon**: Deep #020617 bg, neon accents (#FBBF24, #10B981).
- **Luxury Minimal**: White/light-gray bg, gold/copper accents, serif fonts.
- **Modern Glass**: Layered transparent effects with soft borders.
- **Vibrant Gradient**: Bold linear gradients for buttons/accents.

Technical Stability Requirements (CRITICAL):
1. **Bulletproof Tables**: Use ONLY <table>, <tr>, and <td> for the core structure. Avoid <div> for layouts as they break alignment in Outlook.
2. **Alignment Attributes**: Use 'align="center"' on tables and 'align="left/center/right"' on <td> cells. Use 'valign="top"' for vertical alignment.
3. **Strict Inline CSS**: Every single element must have its styles applied via the 'style' attribute. DO NOT rely on internal <style> blocks for core layout or alignment.
4. **Spacing**: Use 'cellpadding="0"' and 'cellspacing="0"'. Use <td> with specific padding or heights for spacing instead of margins (which are unreliable).
5. **Fluid & Responsive**: 
   - Main wrapper table: width="100%".
   - Content container table: width="100%", style="max-width: 600px;".
   - Images: style="display: block; width: 100%; height: auto; max-width: 100%;".
   - Include: <meta name="viewport" content="width=device-width, initial-scale=1.0">.

Design Principles:
- Use rounded corners (24px-32px) via 'border-radius' (with <td> fallbacks if possible).
- Generous internal padding (40px+) inside content cells.
- Premium typography hierarchy.
- Content must NEVER be cutoff or misaligned.

Return ONLY raw HTML code (no markdown, no preambles).
Variables: Naturally integrate {{variable_name}} for ${variables.length > 0 ? variables.map((v: string) => `{{${v}}}`).join(', ') : "None"}.
Tone: ${tone}
Prompt: "${prompt}"
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
        model: "meta-llama/llama-3.3-70b-instruct",
        messages: [
          { role: "system", content: "You are an expert HTML email developer. You produce clean, table-based, fully inlined HTML emails that look perfect in Outlook and Gmail." },
          { role: "user", content: structuredPrompt }
        ],
        temperature: 0.7, // Lower temperature slightly for more consistent table structure
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("OpenRouter API Error:", data.error);
      return NextResponse.json({ error: data.error.message || "Failed to generate email" }, { status: 500 });
    }

    let htmlContent = data.choices[0].message.content;
    htmlContent = htmlContent.replace(/^```html\s*/, "").replace(/\s*```$/, "");

    return NextResponse.json({ html: htmlContent }, { status: 200 });

  } catch (error: any) {
    console.error("Email generation error:", error);
    return NextResponse.json({ error: "Failed to generate email" }, { status: 500 });
  }
}
