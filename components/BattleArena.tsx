"use client";

import { useState } from "react";
import PromptBox from "@/components/PromptBox";

type Battle = { responseA: string; responseB: string };

export default function BattleArena() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [battle, setBattle] = useState<Battle | null>(null);

  async function startBattle(prompt: string) {
    setLoading(true);
    setError("");
    setBattle(null);
    try {
      const res = await fetch("/api/battle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Request failed");
      setBattle(await res.json());
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PromptBox onSubmit={startBattle} loading={loading} />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {/* Temporary output, replaced by ModelCard in the next commit */}
      {battle && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <p className="rounded-2xl bg-white p-4 text-sm">{battle.responseA}</p>
          <p className="rounded-2xl bg-white p-4 text-sm">{battle.responseB}</p>
        </div>
      )}
    </div>
  );
}