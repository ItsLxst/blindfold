import { Suspense } from "react";
import { connection } from "next/server";
import Header from "@/components/Header";
import { pool } from "@/lib/db";

async function Rankings() {
  await connection();

  const { rows } = await pool.query(
    "select id, name, elo, games from models where games > 0 order by elo desc"
  );

  if (rows.length === 0) {
    return <p className="p-6 text-neutral-500">No votes yet. Run a battle first.</p>;
  }

  return rows.map((m, i) => (
    <div
      key={m.id}
      className="flex items-center gap-5 border-b border-black/10 px-6 py-5 last:border-b-0"
    >
      <span
        className={`w-6 text-lg font-semibold ${
          i === 0 ? "text-violet-600" : "text-neutral-400"
        }`}
      >
        {i + 1}
      </span>
      <div className="flex-1">
        <p className="font-medium">{m.name}</p>
        <p className="text-sm text-neutral-400">
          {m.games} {m.games === 1 ? "game" : "games"}
        </p>
      </div>
      <p className="text-xl font-bold tabular-nums">{Math.round(m.elo)}</p>
    </div>
  ));
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f1] text-neutral-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Live rankings
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">ELO leaderboard</h1>
        <p className="mt-4 text-neutral-500">Rankings update after every anonymous vote.</p>

        <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white">
          <Suspense fallback={<p className="p-6 text-neutral-400">Loading...</p>}>
            <Rankings />
          </Suspense>
        </div>
      </main>
    </div>
  );
}