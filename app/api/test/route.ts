import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 });
  }

  try {
    const openai = new OpenAI({ apiKey: key });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hello in one word." }],
      max_tokens: 10,
    });
    const text = response.choices[0]?.message?.content;
    return NextResponse.json({
      success: true,
      response: text,
      keyPrefix: key.substring(0, 7) + "...",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      error: message,
      keyPrefix: key.substring(0, 7) + "...",
    }, { status: 500 });
  }
}
