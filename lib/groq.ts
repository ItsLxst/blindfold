import type { ArenaModel } from "@/lib/models";

const SYSTEM_PROMPT =
  "Answer in at most 3 short sentences. Plain text only: no markdown, no headings, no tables, no lists, no bold.";

export async function ask(model: ArenaModel, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      // Reasoning tokens count toward the limit, so keep some headroom
      max_tokens: 800,
      reasoning_effort: "low",
    }),
  });

  if (!res.ok) throw new Error(`${model.name} failed: ${res.status}`);

  const data = await res.json();
  return data.choices[0].message.content as string;
}