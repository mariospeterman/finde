'use client';

import { RoiCalculator } from "@/components/roi-calculator";
import { roiPlanThresholds, roiPresets } from "@/data/content";
import { publicEnv } from "@/lib/env";

export function RoiSection() {
  return (
    <section id="roi" aria-labelledby="roi-heading" className="paper-sheet space-y-10 p-6 sm:p-8 lg:p-14">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Return on clarity</p>
        <h2 id="roi-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
          Return on clarity
        </h2>
      </header>

      <RoiCalculator industries={roiPresets} plans={roiPlanThresholds} />
    </section>
  );
}

