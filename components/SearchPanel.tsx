"use client";

import { useState } from "react";

type TrackResult = { id: string; title: string; genre: string | null };

export function SearchPanel() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<TrackResult[]>([]);

  async function runSearch(value: string) {
    setQ(value);
    if (!value) return setResults([]);
    const res = await fetch(`/api/tracks?q=${encodeURIComponent(value)}`);
    const json = await res.json();
    setResults(json.tracks ?? []);
  }

  return (
    <>
      <header className="py-6">
        <input
          autoFocus
          value={q}
          onChange={(e) => runSearch(e.target.value)}
          placeholder="Search songs, artists, albums, playlists…"
          className="w-full max-w-lg rounded-2xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] outline-none focus:border-purple"
        />
      </header>

      <div className="rounded-2xl border border-line bg-panel divide-y divide-line">
        {results.length > 0 ? (
          results.map((t) => (
            <div key={t.id} className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg mascot-orb shrink-0" />
              <div>
                <p className="text-[14px]">{t.title}</p>
                <p className="text-dim text-[12px]">{t.genre ?? "—"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="p-6 text-dim text-[14px]">{q ? "No matches yet." : "Start typing to search."}</p>
        )}
      </div>
    </>
  );
}
