"use client";

import { useState } from "react";
import PromptBox from "@/components/PromptBox";
import ModelCard from "@/components/ModelCard";

type Battle = {
  responseA: string;
  responseB: string;
  modelA: string;
  modelB: string;
};
type Vote = "A" | "B";

export default function BattleArena() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [battle, setBattle] = useState<Battle | null>(null);
  const [vote, setVote] = useState<Vote | null>(null);

  async function startBattle(prompt: string) {
    setLoading(true);
    setError("");
    setBattle(null);
    setVote(null);
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

  function playAgain() {
    setBattle(null);
    setVote(null);
  }

  function resultFor(side: Vote) {
    if (!vote) return undefined;
    return vote === side ? "picked" : "not-picked";
  }

  return (
    <div>
      <PromptBox onSubmit={startBattle} loading={loading} />
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {battle && (
        <div className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <ModelCard
              label="Model A"
              text={battle.responseA}
              onVote={() => setVote("A")}
              result={resultFor("A")}
              revealedName={battle.modelA}
            />
            <ModelCard
              label="Model B"
              text={battle.responseB}
              onVote={() => setVote("B")}
              result={resultFor("B")}
              revealedName={battle.modelB}
            />
          </div>

          {vote && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-violet-100 px-6 py-4 text-violet-900">
              <p>
                <span className="font-semibold">Vote counted.</span> You preferred{" "}
                {vote === "A" ? battle.modelA : battle.modelB}.
              </p>
              <button onClick={playAgain} className="font-semibold underline">
                Play again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}