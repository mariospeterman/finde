'use client';

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

import { pricingPlans } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { ApplyButton } from "@/components/apply-button";
import { CardSwap, Card } from "@/components/card-swap";

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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="space-y-10">
      <header className="space-y-4 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Pricing</p>
        <h2 id="pricing-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
          Clarity that compounds.
        </h2>
        <p className="mx-auto max-w-3xl text-base text-slate-600 md:mx-0">
          {publicEnv.brandName} pilots stay free until you convert. Paid licences start at {starterPrice} per seat and scale with
          your governance, infrastructure, and compliance needs.
        </p>
      </header>

      {/* Card Swap - All Screen Sizes */}
      <div className="w-full py-12 md:py-16 -mx-4 sm:mx-0">
        <CardSwap 
          className="h-[580px] md:h-[580px] w-full max-w-5xl mx-auto px-4 sm:px-0" 
          width="100%"
          height={580}
          cardDistance={isDesktop ? 40 : 28} 
          verticalDistance={isDesktop ? 50 : 35}
          delay={5000}
        >
          {pricingPlans.map((plan) => {
            const isHighlight = plan.highlight;
            const showComingSoonFlag = plan.comingSoon && (!plan.badge || plan.badge.toLowerCase() !== "coming soon");
            const badgeStyle = isHighlight
              ? "bg-blue-100/80 text-blue-700 shadow-sm shadow-blue-100"
              : "bg-blue-50 text-blue-700";
            const badgeId = `${plan.name}-badge`;

            return (
              <Card
                key={plan.name}
                className={`flex h-full flex-col p-4 md:p-6 w-full max-w-[calc(100%-1.5rem)] sm:max-w-none rounded-[26px] border-white/50 bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur ${
                  isHighlight
                    ? "bg-gradient-to-br from-white via-blue-50 to-white"
                    : ""
                }`}
                role="article"
                aria-labelledby={`pricing-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex items-center justify-between gap-2 mb-2 md:mb-3 flex-shrink-0">
                  {plan.badge ? (
                    <span
                      id={badgeId}
                      className={`inline-flex items-center rounded-full px-2.5 md:px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.28em] ${badgeStyle}`}
                      aria-label={`${plan.badge} badge`}
                    >
                      {plan.badge}
                    </span>
                  ) : (
                    <span className="sr-only">{plan.name}</span>
                  )}
                  {showComingSoonFlag && (
                    <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.35em] text-blue-300">Coming soon</span>
                  )}
                </div>
                <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-3 flex-shrink-0">
                  <h3 id={`pricing-${plan.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-lg md:text-2xl font-semibold text-slate-900 leading-tight tracking-tight">{plan.name}</h3>
                  <p className="text-xs md:text-base text-slate-600 leading-relaxed">{plan.description}</p>
                </div>
                <div className="space-y-0.5 md:space-y-1 mb-3 md:mb-4 flex-shrink-0">
                  <p className="text-xl md:text-3xl font-semibold text-slate-900 leading-tight tracking-tight" aria-label={`Price: ${plan.price}`}>{plan.price}</p>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-blue-500">
                    {isHighlight ? "Best for pilot momentum" : "Includes ROI dashboards & admin controls"}
                  </p>
                </div>
                <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-slate-600 flex-1 min-h-0 overflow-y-auto" role="list" aria-label="Plan features">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 md:h-5 md:w-5 flex-shrink-0 text-emerald-500" aria-hidden="true" focusable="false" />
                      <span className="leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 md:pt-3 mt-auto flex-shrink-0">
                  <ApplyButton
                    source={`pricing-${plan.intent}`}
                    plan={plan.intent}
                    className="w-full justify-center bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-200 text-xs md:text-base py-2 md:py-3"
                    aria-describedby={plan.badge ? badgeId : undefined}
                  >
                    {plan.cta}
                  </ApplyButton>
        </div>
                <span className="text-[9px] md:text-xs uppercase tracking-[0.3em] text-blue-500 text-center mt-1.5 md:mt-2 flex-shrink-0" aria-label="Navigation hint">
                  {isDesktop ? "Click or hover to pause" : "Tap or swipe for more plans"}
                </span>
              </Card>
            );
          })}
        </CardSwap>
      </div>
    </section>
  );
}

