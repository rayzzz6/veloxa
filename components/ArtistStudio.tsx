"use client";

import { useState } from "react";

export function ArtistStudio() {
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title) return;
    setStatus("Uploading…");

    const form = new FormData();
    form.append("audio", file);
    form.append("title", title);
    form.append("genre", genre);
    form.append("visibility", "public");

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();

    if (!res.ok) {
      setStatus(`Error: ${json.error}`);
      return;
    }
    setStatus("Uploaded — pending moderation review.");
    setShowUpload(false);
    setTitle("");
    setGenre("");
    setFile(null);
  }

  return (
    <>
      <header className="flex items-center justify-between py-6">
        <h1 className="font-display font-semibold text-2xl">Artist studio</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="rounded-full bg-brand-gradient text-black px-5 py-2.5 text-[14px] font-semibold"
        >
          Upload track
        </button>
      </header>

      {status && <p className="text-dim text-[13px] mb-4">{status}</p>}

      <p className="text-dim text-[14px]">
        Uploaded tracks are stored in Supabase Storage and inserted into the{" "}
        <code className="text-white/70">tracks</code> table with{" "}
        <code className="text-white/70">moderation_status = 'pending'</code>. They appear on Home/Search once an
        admin approves them from the admin panel.
      </p>

      {showUpload && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-30">
          <form onSubmit={handleUpload} className="glass rounded-3xl p-7 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-lg">Upload a track</h3>
              <button type="button" onClick={() => setShowUpload(false)} className="text-dim">
                ✕
              </button>
            </div>
            <input
              type="file"
              accept="audio/mpeg,audio/flac,audio/wav,audio/aac,audio/ogg"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-[13px] text-dim"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Track title"
              className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] outline-none focus:border-purple"
            />
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre"
              className="w-full rounded-xl border border-line bg-white/[0.03] px-4 py-3 text-[14px] outline-none focus:border-purple"
            />
            <button type="submit" className="w-full rounded-full bg-brand-gradient text-black py-3 font-semibold">
              Publish track
            </button>
          </form>
        </div>
      )}
    </>
  );
}
