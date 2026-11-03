export type ArenaModel = { id: string; name: string };

export const MODELS: ArenaModel[] = [
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" },
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B" },
];

export function pickTwo(): [ArenaModel, ArenaModel] {
  const pool = [...MODELS].sort(() => Math.random() - 0.5);
  return [pool[0], pool[1]];
}