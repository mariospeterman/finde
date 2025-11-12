'use client';

import { Check } from "lucide-react";

import { pricingPlans } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { ApplyButton } from "@/components/apply-button";

const formatCurrency = (value: number) => {
  const maximumFractionDigits = Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

export function PricingSection() {
  const starterPrice = formatCurrency(publicEnv.roiPricing.starter);

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="space-y-10">
      <header className="space-y-4 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Pricing</p>
        <h2 id="pricing-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
          Clarity that compounds.
        </h2>
        <p className="mx-auto max-w-3xl text-base text-slate-600 md:mx-0">
          {publicEnv.brandName} pilots stay free until you convert. Paid licences start at {starterPrice} per seat and scale with
          your governance, infrastructure, and compliance needs.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {pricingPlans.map((plan) => {
          const isHighlight = Boolean(plan.highlight);
          const showComingSoonFlag = plan.comingSoon && (!plan.badge || plan.badge.toLowerCase() !== "coming soon");
          const cardBase =
            "flex h-full min-h-[420px] flex-col gap-6 rounded-3xl border p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg";
          const cardTheme = isHighlight ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900";
          const descriptionColour = isHighlight ? "text-white/80" : "text-slate-600";
          const featureColour = isHighlight ? "text-white/80" : "text-slate-600";
          const badgeStyle = isHighlight ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700";
          const ctaColours = isHighlight
            ? "bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-white focus-visible:outline-offset-2"
            : "bg-slate-900 text-white hover:bg-slate-800";
          const iconColour = isHighlight ? "text-emerald-200" : "text-emerald-500";

          const badgeId = `${plan.name}-badge`;

          return (
            <article key={plan.name} className={`${cardBase} ${cardTheme}`} aria-labelledby={`${plan.name}-title`}>
              <div className="flex items-center justify-between gap-3">
                {plan.badge ? (
                  <span
                    id={badgeId}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle}`}
                    aria-label={`${plan.badge} badge`}
                  >
                    {plan.badge}
                  </span>
                ) : (
                  <span className="sr-only">{plan.name}</span>
                )}
                {showComingSoonFlag && (
                  <span className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Coming soon</span>
                )}
              </div>
              <div className="space-y-3">
                <h3 id={`${plan.name}-title`} className="text-2xl font-semibold">
                  {plan.name}
                </h3>
                <p className={`text-sm ${descriptionColour}`}>{plan.description}</p>
              </div>
              <div className="space-y-2">
                <p className={`text-3xl font-semibold ${isHighlight ? "text-white" : "text-slate-900"}`}>{plan.price}</p>
                <p className={`text-xs uppercase tracking-[0.3em] ${descriptionColour}`}>
                  {isHighlight ? "Best for pilot momentum" : "Includes ROI dashboards & admin controls"}
                </p>
              </div>
              <ul className={`space-y-3 text-sm ${featureColour}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`mt-1 h-4 w-4 flex-shrink-0 ${iconColour}`} aria-hidden="true" focusable="false" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-2">
                <ApplyButton
                  source={`pricing-${plan.intent}`}
                  plan={plan.intent}
                  className={`${ctaColours} w-full justify-center`}
                  aria-describedby={plan.badge ? badgeId : undefined}
                >
                  {plan.cta}
                </ApplyButton>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

