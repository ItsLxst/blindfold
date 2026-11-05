import { NextResponse } from "next/server";
import { pickTwo } from "@/lib/models";
import { ask, RateLimitError } from "@/lib/llm";
import { pool } from "@/lib/db";

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

    for (const m of [a, b]) {
      await pool.query(
        "insert into models (id, name) values ($1, $2) on conflict (id) do update set name = excluded.name",
        [m.id, m.name]
      );
    }

    const { rows } = await pool.query(
      `insert into matches (prompt, model_a, model_b, response_a, response_b)
       values ($1, $2, $3, $4, $5) returning id`,
      [prompt, a.id, b.id, responseA, responseB]
    );

    return NextResponse.json({ matchId: rows[0].id, responseA, responseB });
  } catch (e) {
    if (e instanceof RateLimitError) {
      return NextResponse.json({ error: "Free limit reached" }, { status: 429 });
    }
    return NextResponse.json({ error: "Model call failed" }, { status: 502 });
  }
}