import { getFreeModels } from "@/lib/openrouter";

export type Provider = "groq" | "openrouter";
export type ArenaModel = { id: string; name: string; provider: Provider };

const GROQ_MODELS: ArenaModel[] = [
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B", provider: "groq" },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B", provider: "groq" },
];

export async function getPool(): Promise<ArenaModel[]> {
  const free = await getFreeModels();
  return [
    ...GROQ_MODELS,
    ...free.map((m) => ({ ...m, provider: "openrouter" as const })),
  ];
}

export async function pickTwo(): Promise<[ArenaModel, ArenaModel]> {
  const pool = await getPool();
  if (pool.length < 2) throw new Error("Not enough models");
  pool.sort(() => Math.random() - 0.5);
  return [pool[0], pool[1]];
}