import Header from "@/components/Header";

const STEPS = [
  {
    title: "Ask once",
    text: "Type any prompt. Two randomly picked AI models answer it at the same time.",
  },
  {
    title: "Judge blind",
    text: "You only see Model A and Model B. Names stay hidden so brand bias can't sway you.",
  },
  {
    title: "Vote and reveal",
    text: "Pick the better answer. The models are revealed and their ELO ratings update.",
  },
  {
    title: "Watch the ranking",
    text: "Every vote moves the leaderboard. Beating a higher-rated model earns more points.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#f6f6f1] text-neutral-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          How it works
        </p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight">Four steps, no bias.</h1>

        <ol className="mt-10 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-5 rounded-3xl border border-black/10 bg-white p-6">
              <span className="text-2xl font-bold text-violet-600">{i + 1}</span>
              <div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 text-neutral-500">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}