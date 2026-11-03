"use client";

import { useState } from "react";

type Props = {
  onSubmit: (prompt: string) => void;
  loading: boolean;
};

export default function PromptBox({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");
  const canSend = value.trim().length > 0 && !loading;

  function send() {
    if (canSend) onSubmit(value.trim());
  }

  return (
    <div className="mt-12 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
        }}
        maxLength={1000}
        placeholder="Ask anything..."
        className="h-32 w-full resize-none bg-transparent text-lg outline-none placeholder:text-neutral-400"
      />
      <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
        <span className="text-sm text-neutral-400">⌘ + Enter to send</span>
        <button
          onClick={send}
          disabled={!canSend}
          className="rounded-full bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {loading ? "Battling..." : "Start battle"}
        </button>
      </div>
    </div>
  );
}