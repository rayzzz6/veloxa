"use client";

import { useEffect, useRef, useState } from "react";

export function Waveform({ active = false, count = 40 }: { active?: boolean; count?: number }) {
  const [heights, setHeights] = useState(() =>
    Array.from({ length: count }, () => 6 + Math.random() * 22)
  );
  const raf = useRef<number>();
  const last = useRef(0);

  useEffect(() => {
    const speed = active ? 70 : 220;
    const tick = (t: number) => {
      if (t - last.current > speed) {
        last.current = t;
        setHeights((prev) =>
          prev.map((h) => {
            const target = 6 + Math.random() * (active ? 40 : 22);
            return h + (target - h) * 0.5;
          })
        );
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [active]);

  return (
    <div className="flex items-end gap-[3px] h-full w-full">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-full transition-[height] duration-150 ease-out"
          style={{
            height: `${h}px`,
            background: "linear-gradient(180deg, #FF4DA6 0%, #7C4DFF 100%)",
            opacity: 0.35 + (h / 46) * 0.65,
          }}
        />
      ))}
    </div>
  );
}
