'use client';

import { ShieldCheck } from "lucide-react";
import type { ChangeEvent } from "react";

type BeforeAfterSliderProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function BeforeAfterSlider({ value, onChange, className = "" }: BeforeAfterSliderProps) {
  const handlePosition = `${value}%`;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number.parseInt(event.target.value, 10);
    onChange(clamp(nextValue, Number(event.target.min), Number(event.target.max)));
  };

  return (
    <div className={`paper-sheet space-y-6 p-6 sm:p-8 ${className}`}>
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-blue-500">
        <span>Work as usual</span>
        <span className="inline-flex items-center gap-2 text-blue-500">
          <ShieldCheck className="h-4 w-4 text-emerald-500" aria-hidden="true" focusable="false" />
          Flow with Finde
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-blue-100 bg-blue-50/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/after.png"
          alt="Organised Finde workspace"
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          width={800}
          height={500}
          sizes="(min-width: 1024px) 520px, 100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - value}% 0 0)`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image/befor.png"
            alt="Before Finde chaotic folders"
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            width={800}
            height={500}
            sizes="(min-width: 1024px) 520px, 100vw"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-blue-500/40 backdrop-blur-sm"
          style={{ left: handlePosition, transform: "translateX(-50%)" }}
        />
        <div
          className="absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-700 shadow-md shadow-blue-100"
          style={{ left: handlePosition, transform: "translate(-50%, -50%)" }}
        >
          ⇆
        </div>
        <input
          type="range"
          min={5}
          max={95}
          value={value}
          onChange={handleChange}
          className="absolute bottom-4 left-1/2 w-[60%] -translate-x-1/2 cursor-pointer accent-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-200 focus-visible:outline-offset-2"
          aria-label="Compare before and after Finde"
        />
      </div>
      <p className="text-sm text-slate-600">
        Slide to feel the shift—from overflowing folders to instant answers with context, citations, and next steps powered by Finde.
      </p>
    </div>
  );
}

