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
You are a world-class email designer and HTML developer. 
Create a "WOW" factor, premium HTML email template. 

Creative Guidelines:
1. **Dynamic Aesthetics**: Do NOT stick to a single color theme. Choose a palette that perfectly fits the prompt (e.g., Bold Dark with neons, Elegant Light with pastels, Modern Corporate with gradients, or Vibrant & Playful).
2. **Premium Elements**: Use sophisticated design features like:
   - High-end typography hierarchy (-apple-system, Arial).
   - Horizontal gradient accent lines or backgrounds.
   - Padded content blocks with subtle borders or tinted backgrounds.
   - Elegant quote blocks or callouts with accent side-borders.
   - Luxury touches like increased letter-spacing for sub-headers and generous whitespace.
3. **Strict Mobile Responsiveness**: Content MUST be 100% responsive. 
   - Use the viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1.0">.
   - Use a 'Fluid-Hybrid' approach: All main containers and tables must have 'width: 100% !important' with a 'max-width: 600px' (or 640px) constraint.
   - Use @media queries to adjust padding, font-sizes, and stack multi-column layouts on screens smaller than 600px.
   - **CRITICAL**: Content must NEVER be cutoff; it must reflow to fit the device width perfectly.

Technical Requirements:
1. Return ONLY raw HTML code (no markdown, no preambles).
2. **CSS**: Use primarily **inline CSS** for maximum compatibility. You may use **internal CSS** in a <style> block for hover effects, transitions, and media queries.
3. **Variables**: Naturally integrate {{variable_name}} for ${variables.length > 0 ? variables.map((v: string) => `{{${v}}}`).join(', ') : "None"}.
4. **Content Flow**: Header -> Hero Section -> Body -> Highlight/Quote Block -> High-contrast CTA -> Professional Footer.

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
