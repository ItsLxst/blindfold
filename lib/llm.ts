import type { ArenaModel } from "@/lib/models";

export class RateLimitError extends Error {}

const ENDPOINTS = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    key: "GROQ_API_KEY",
    extra: { reasoning_effort: "low" },
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: "OPENROUTER_API_KEY",
    extra: { reasoning: { effort: "low" } },
  },
} as const;

const INSTRUCTION =
  "Answer in at most 3 short sentences. Plain text only: no markdown, no headings, no tables, no lists, no bold.";

function clean(text: string): string {
  return text
    .replace(/^#+\s*/gm, "")
    .replace(/[*`|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function ask(model: ArenaModel, prompt: string): Promise<string> {
  const { url, key, extra } = ENDPOINTS[model.provider];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env[key]}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: "user", content: `${INSTRUCTION}\n\n${prompt}` }],
      max_tokens: 800,
      ...extra,
    }),
  });

  if (res.status === 429) throw new RateLimitError(model.name);
  if (!res.ok) throw new Error(`${model.name} failed: ${res.status}`);

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`${model.name} returned no answer`);

  return clean(text);
}