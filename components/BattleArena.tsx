"use client";

import { useState } from "react";
import PromptBox from "@/components/PromptBox";
import ModelCard from "@/components/ModelCard";

type Battle = { matchId: string; responseA: string; responseB: string };
type Side = "A" | "B";
type Reveal = { modelA: string; modelB: string; eloA: number; eloB: number };

export default function BattleArena() {
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState("");
  const [battle, setBattle] = useState<Battle | null>(null);
  const [vote, setVote] = useState<Side | null>(null);
  const [reveal, setReveal] = useState<Reveal | null>(null);

  function reset() {
    setBattle(null);
    setVote(null);
    setReveal(null);
  }

  async function startBattle(prompt: string) {
    setLoading(true);
    setError("");
    reset();
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

  async function castVote(side: Side) {
    if (!battle || voting) return;
    setVoting(true);
    setError("");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: battle.matchId, winner: side }),
      });
      if (!res.ok) throw new Error("Vote failed");
      setReveal(await res.json());
      setVote(side);
    } catch {
      setError("Could not save your vote. Try again.");
    } finally {
      setVoting(false);
    }
  }

  function resultFor(side: Side) {
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
              onVote={() => castVote("A")}
              result={resultFor("A")}
              revealedName={reveal?.modelA}
              revealedElo={reveal?.eloA}
            />
            <ModelCard
              label="Model B"
              text={battle.responseB}
              onVote={() => castVote("B")}
              result={resultFor("B")}
              revealedName={reveal?.modelB}
              revealedElo={reveal?.eloB}
            />
          </div>

          {vote && reveal && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-violet-100 px-6 py-4 text-violet-900">
              <p>
                <span className="font-semibold">Vote counted.</span> You preferred{" "}
                {vote === "A" ? reveal.modelA : reveal.modelB}.
              </p>
              <button onClick={reset} className="font-semibold underline">
                Play again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}