export type FreeModel = { id: string; name: string };

type ApiModel = {
  id: string;
  name: string;
  architecture?: { input_modalities?: string[]; output_modalities?: string[] };
};

let cache: { models: FreeModel[]; at: number } | null = null;
const TTL = 60 * 60 * 1000;

export async function getFreeModels(): Promise<FreeModel[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.models;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    if (!res.ok) return cache?.models ?? [];

    const { data } = (await res.json()) as { data: ApiModel[] };
    const models = data
      .filter((m) => m.id.endsWith(":free"))
      .filter((m) => m.architecture?.output_modalities?.join() === "text")
      .filter((m) => m.architecture?.input_modalities?.includes("text"))
      .map((m) => ({ id: m.id, name: m.name.replace(/\s*\(free\)$/i, "") }));

    cache = { models, at: Date.now() };
    return models;
  } catch {
    return cache?.models ?? [];
  }
}