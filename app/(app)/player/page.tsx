"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Waveform } from "@/components/Waveform";

export default function PlayerPage() {
  const [playing, setPlaying] = useState(true);

  return (
    <div className="flex">
      <Sidebar active="/player" />
      <main className="flex-1 min-h-screen flex flex-col items-center justify-center px-8 pb-16 text-center">
        <div className="w-64 h-64 rounded-3xl mascot-orb mb-8" />
        <h1 className="font-display font-semibold text-2xl">Skin</h1>
        <p className="text-dim mt-1">Flume</p>

        <div className="w-full max-w-md h-14 mt-8">
          <Waveform active={playing} />
        </div>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center text-black mt-8"
        >
          {playing ? "❙❙" : "▶"}
        </button>

        <p className="text-dim text-[12px] mt-6 max-w-sm">
          This view has no audio wired up yet — connect it to your streaming provider's playback SDK once tracks
          are approved and served from Storage.
        </p>
      </main>
    </div>
  );
}
