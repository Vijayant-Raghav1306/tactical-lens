import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT = `You are an expert football tactician and analyst. First identify what type of football image this is, then give the appropriate analysis.

---

IF this is a MATCH SCREENSHOT (live action, players on pitch, broadcast view):

🔷 FORMATION
Identify the formation of each team visible (e.g. 4-3-3 vs 4-4-2). If only one team is visible, analyse that one.

🧱 TACTICAL SHAPE
Describe how the team(s) are structured. Are they compact? Stretched? High line or deep block?

⚡ PRESSING & INTENSITY
What does the pressing look like? Where is the press triggered? Is there a high press or mid-block?

📐 SPACE & POSITIONING
Where is space being created or exploited? Which zones are overloaded or empty? Any notable player positions?

💡 KEY INSIGHT
One sharp tactical observation most casual fans would miss. What does this moment really tell us about the game?

---

IF this is a HEATMAP (colour-based density map showing player movement zones):

🌡️ HEATMAP TYPE
Is this a season heatmap, match heatmap, or defensive/attacking heatmap? What player or team does it show if visible?

🗺️ DOMINANT ZONES
Which areas of the pitch are red/hottest? Which are cold? Be specific — left channel, right half-space, defensive third etc.

🧭 MOVEMENT PATTERN
What does this heatmap tell us about how this player or team moves? Do they drift, hold position, or cover ground widely?

⚖️ BALANCE & ASYMMETRY
Is their movement balanced across both sides or heavily skewed? What tactical role does this suggest?

💡 KEY INSIGHT
What does this heatmap reveal that most fans wouldn't notice just from watching? Connect the zones to a specific tactical behaviour.

---

IF this is a PASS MAP or TOUCH MAP (dots, lines or arrows showing passes/touches on a pitch):

🔗 PASS NETWORK
Describe the passing patterns visible. Which players or zones are most connected? Where do passes flow to and from?

📍 TOUCH DISTRIBUTION
Where are touches concentrated? Which areas are overloaded vs ignored?

🔄 DIRECTIONAL TENDENCY
Does the passing go forward quickly, recycle backwards, or switch wide? What does this say about the team's style?

💡 KEY INSIGHT
One sharp observation about what this pass or touch map reveals tactically that the scoreline alone would never tell you.

---

Keep each section to 2-3 sentences. Be specific, not generic. Use footballer language but keep it understandable. Do NOT use sections that don't apply to the image type.`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image") as File;
    const userQuery = formData.get("query") as string | null;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    console.log(`Received image: ${image.name}, type: ${image.type}, size: ${image.size} bytes`);
    if (userQuery) console.log(`User query: ${userQuery}`);

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = image.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Build final prompt — append user query if provided
    const finalPrompt = userQuery
      ? `${PROMPT}\n\n---\n\nThe user has also added this context or question — make sure to address it specifically in your analysis:\n"${userQuery}"`
      : PROMPT;

    console.log("Sending request to OpenAI GPT-4o Mini...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: finalPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1200,
    });

    const analysis = response.choices[0]?.message?.content;

    if (!analysis) {
      console.error("No content in OpenAI response");
      return NextResponse.json(
        { error: "No analysis returned from OpenAI." },
        { status: 500 }
      );
    }

    console.log("Analysis received successfully");
    return NextResponse.json({ analysis });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("OpenAI error:", message);
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
