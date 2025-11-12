'use client';

import { RoiCalculator } from "@/components/roi-calculator";
import { roiPlanThresholds, roiPresets } from "@/data/content";
import { publicEnv } from "@/lib/env";

export function RoiSection() {
  return (
    <section id="roi" aria-labelledby="roi-heading" className="paper-sheet space-y-10 p-6 sm:p-8 lg:p-14">
      <header className="space-y-3 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Return on clarity</p>
        <h2 id="roi-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
          Quantify {publicEnv.brandName}&apos;s impact before you invest
        </h2>
        <p className="mx-auto max-w-3xl text-base text-slate-600 md:mx-0">
          Input the blend of roles piloting {publicEnv.brandName}. We update seat pricing, licence tiers, and ROI assumptions as
          your pricing model evolves so the business case stays accurate.
        </p>
      </header>

      <RoiCalculator industries={roiPresets} plans={roiPlanThresholds} />
    </section>
  );
}

