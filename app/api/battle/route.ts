import { NextResponse } from "next/server";
import { pickTwo } from "@/lib/models";
import { ask, RateLimitError } from "@/lib/llm";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 1000) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  try {
    const [a, b] = await pickTwo();
    const [responseA, responseB] = await Promise.all([
      ask(a, prompt),
      ask(b, prompt),
    ]);
    // Model names are returned for now; they get hidden behind a matchId once the DB is in
    return NextResponse.json({ responseA, responseB, modelA: a.name, modelB: b.name });
  } catch (e) {
    if (e instanceof RateLimitError) {
      return NextResponse.json({ error: "Free limit reached" }, { status: 429 });
    }
    return NextResponse.json({ error: "Model call failed" }, { status: 502 });
  }
}