import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-5 w-7 rounded-t-full bg-neutral-900" />
          <span className="text-lg font-semibold tracking-tight">Blindfold</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/leaderboard"
            className="px-3 py-2 text-neutral-600 transition hover:text-violet-600"
          >
            Leaderboard
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-full border border-black/10 bg-white px-4 py-2 transition hover:border-violet-500 hover:text-violet-600"
          >
            How it works
          </Link>
        </nav>
      </div>
    </header>
  );
}