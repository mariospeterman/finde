'use client';

import { RoiCalculator } from "@/components/roi-calculator";
import { roiPlanThresholds, roiPresets } from "@/data/content";

export function RoiSection() {
  return (
    <section id="roi" aria-labelledby="roi-heading" className="paper-sheet space-y-10 p-6 sm:p-8 lg:p-14">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Return on time</p>
        
      </header>

      <RoiCalculator industries={roiPresets} plans={roiPlanThresholds} />
    </section>
  );
}

