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

    // 3. Construct Prompt with Atmospheric & Gradient Enforcement
    const structuredPrompt = `
You are an elite Digital Designer for brands like Linear, Stripe, and Apple. 
Create an "Atmospheric Premium" email template. 

STRICT AESTHETIC DIRECTIVES (CRITICAL):
1. **NO PLAIN WHITE BACKGROUNDS**: Avoid pure #ffffff backgrounds for the main wrapper. 
2. **Monochromatic Gradients**: Use sophisticated, single-hue gradients for the main background. 
   - Example: Deep Indigo (#1e1b4b) to Midnight (#0f172a).
   - Example: Soft Slate (#f1f5f9) to Pearl (#e2e8f0).
3. **The "Glow" Effect**: Use inner-glows or subtle light-source effects in the corners of cards.
4. **Card-Based Glassmorphism**: Place content on "Glass" cards:
   - 'background: rgba(255,255,255,0.03);' for dark themes.
   - 'background: rgba(255,255,255,0.8);' for light themes.
   - 'backdrop-filter: blur(20px);' (with solid color fallbacks for Outlook).
5. **High-End Typography**: 
   - H1: Large, bold, 'letter-spacing: -0.04em;'.
   - Use 'background-clip: text;' with a gradient if possible for headings.
6. **Responsive Card**: 40px rounded corners, deep soft shadow (0 50px 100px rgba(0,0,0,0.2)).

COLOR SYSTEMS (Mandatory - choose one):
- **Obsidian Indigo**: Background: Linear gradient from #0c0c0e to #1e1b4b. Accents: #6366f1.
- **Deep Emerald**: Background: Linear gradient from #064e3b to #022c22. Accents: #10b981.
- **Silver Frost**: Background: Linear gradient from #f8fafc to #cbd5e1. Accents: #334155.

TECHNICAL REQUIREMENTS:
- Fluid-Hybrid responsive structure (width="100%", max-width: 600px).
- ALL styles must be inlined.
- Use only <table> for layout.
- Include Outlook XML and Viewport meta tags.

Return ONLY the raw HTML code starting with <!DOCTYPE html>. Do not include markdown blocks.
Variables: ${variables.length > 0 ? variables.map((v: string) => `{{${v}}}`).join(', ') : "None"}.
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
          { role: "system", content: "You are a master of premium, atmospheric email design. You create immersive, high-end experiences using monochromatic gradients and glassmorphism." },
          { role: "user", content: structuredPrompt }
        ],
        temperature: 0.6,
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
