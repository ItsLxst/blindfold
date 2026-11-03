import type { ArenaModel } from "@/lib/models";

export async function ask(model: ArenaModel, prompt: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    }),
  });

  if (!res.ok) throw new Error(`${model.name} failed: ${res.status}`);

  const data = await res.json();
  return data.choices[0].message.content as string;
}