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
                className={`flex h-full flex-col p-6 md:p-8 w-full max-w-[calc(100%-1.5rem)] sm:max-w-none rounded-[26px] border border-white/50 bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur ${
                  isHighlight
                    ? "border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white ring-2 ring-blue-200"
                    : plan.comingSoon
                    ? "border-slate-200 bg-white/90 opacity-75"
                    : "border-slate-200 bg-white"
                }`}
                role="article"
                aria-labelledby={`pricing-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex h-full flex-col gap-4 text-left">
                  {plan.badge && (
                    <span
                      id={badgeId}
                      className={`inline-flex w-max items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                        isHighlight ? 'bg-blue-100 text-blue-700' : plan.comingSoon ? 'bg-white/60 text-slate-500' : 'bg-white/85 text-slate-600'
                      }`}
                      aria-label={`${plan.badge} badge`}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <div className="space-y-2">
                    <h3 id={`pricing-${plan.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500" aria-label={`Price: ${plan.price}`}>{plan.price}</p>
                    <p className="text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-700 flex-1 min-h-0 overflow-y-auto" role="list" aria-label="Plan features">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-[2px] h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" focusable="false" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2">
                    <ApplyButton
                      source={`pricing-${plan.intent}`}
                      plan={plan.intent}
                      className={`w-full justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                        isHighlight
                          ? 'bg-blue-600 text-white hover:bg-blue-500'
                          : 'border border-slate-300 text-slate-900 hover:border-slate-600'
                      } ${plan.comingSoon ? 'pointer-events-none opacity-70' : ''}`}
                      aria-describedby={plan.badge ? badgeId : undefined}
                      disabled={plan.comingSoon}
                    >
                      {plan.cta}
                    </ApplyButton>
                  </div>
                </div>
              </Card>
            );
          })}
        </CardSwap>
      </div>
    </section>
  );
}

