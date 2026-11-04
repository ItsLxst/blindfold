type Props = {
  label: string;
  text: string;
  onVote?: () => void;
  result?: "picked" | "not-picked";
  revealedName?: string;
};

export default function ModelCard({ label, text, onVote, result, revealedName }: Props) {
  const picked = result === "picked";

  return (
    <div
      className={`flex flex-col rounded-3xl border bg-white p-6 transition ${
        picked ? "border-violet-500 ring-1 ring-violet-500" : "border-black/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold">
          {label}
        </span>
        {result && (
          <span className={`text-sm font-medium ${picked ? "text-violet-600" : "text-neutral-400"}`}>
            {picked ? "Your pick" : "Not selected"}
          </span>
        )}
      </div>

      <p className="mt-5 flex-1 text-lg leading-relaxed text-neutral-700">{text}</p>

      {result ? (
        <div className="mt-6 border-t border-black/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Revealed model
          </p>
          <p className="mt-1 text-lg font-semibold">{revealedName}</p>
        </div>
      ) : (
        <button
          onClick={onVote}
          className="mt-6 rounded-full border border-black/10 py-3 font-medium transition hover:border-violet-500 hover:bg-violet-50 hover:text-violet-600"
        >
          This is better
        </button>
      )}
    </div>
  );
}