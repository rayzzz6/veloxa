"use client";

import { useState } from "react";
import { Waveform } from "@/components/Waveform";

export function PlayerControls() {
  const [playing, setPlaying] = useState(true);

  return (
    <>
      <div className="w-full max-w-md h-14 mt-8">
        <Waveform active={playing} />
      </div>

      <button
        onClick={() => setPlaying((p) => !p)}
        className="w-16 h-16 rounded-full bg-brand-gradient flex items-center justify-center text-black mt-8"
      >
        {playing ? "❙❙" : "▶"}
      </button>
    </>
  );
}
