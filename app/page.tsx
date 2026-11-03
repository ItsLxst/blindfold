import Header from "@/components/Header";
import BattleArena from "@/components/BattleArena";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f6f1] text-neutral-900">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Blind test the best models
        </p>
        <h1 className="mt-4 text-6xl font-bold tracking-tight">
          Ask once. Judge without bias.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-neutral-500">
          Two anonymous AI models answer your prompt. Pick the better response,
          then reveal who was behind it.
        </p>
        <BattleArena />
      </main>
    </div>
  );
}