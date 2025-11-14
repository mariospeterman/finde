'use client';

import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";

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
      <div className="max-w-3xl space-y-4">
        <h2 id="pricing-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
          Pricing for teams who already own the answers.
        </h2>
        <p className="text-base text-slate-600">
          High-trust knowledge deserves high-trust deployment. We are currently onboarding pilot teams; paid licences open soon. Choose the pilot today and reserve your spot in the plan that fits your scale.
        </p>
      </div>
      <div className="mx-auto mt-12 w-full">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                Why start with the pilot?
              </h3>
              <p className="text-lg text-slate-600">
                Guided onboarding, measurable ROI and licence credit make the pilot the calmest way to feel {publicEnv.brandName}&apos;s value.
              </p>
            </div>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex gap-3">
                <Check className="mt-[4px] h-4 w-4 text-emerald-500 flex-shrink-0" />
                Free setup (3–6 weeks) with relevance workshops, audit logs and KPI tracking included.
              </li>
              <li className="flex gap-3">
                <Check className="mt-[4px] h-4 w-4 text-emerald-500 flex-shrink-0" />
                Decide on self-hosted, hybrid GPU or managed cloud once your team experiences the pilot.
              </li>
              <li className="flex gap-3">
                <Check className="mt-[4px] h-4 w-4 text-emerald-500 flex-shrink-0" />
                Convert within 60 days and the pilot credit rolls into your first licence.
              </li>
            </ul>
            <ApplyButton
              source="pricing-pilot-cta"
              plan="pilot-program"
              className="inline-flex w-max items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Apply for the pilot
              <ArrowRight className="h-4 w-4" />
            </ApplyButton>
          </div>
          <div className="hidden justify-end md:flex">
            <CardSwap
              width={360}
              height={420}
              cardDistance={60}
              verticalDistance={70}
              delay={0}
              pauseOnHover={false}
              className="cursor-pointer"
            >
              {pricingPlans.map((plan) => {
                const isPilot = plan.highlight && !plan.comingSoon;
                const cardAccent = isPilot
                  ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200'
                  : plan.comingSoon
                    ? 'border-slate-200 bg-white/90 opacity-75'
                    : 'border-slate-200 bg-white';
                const iconColor = isPilot ? 'text-emerald-500' : 'text-blue-500';
                const ctaClasses = isPilot
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'border border-slate-300 text-slate-900 hover:border-slate-600';
    const badgeId = `${plan.name}-badge`;

    return (
                  <Card key={plan.name} className={`p-8 border ${cardAccent}`}>
                    <div className="flex h-full flex-col gap-4 text-left">
                      {plan.badge && (
            <span
              id={badgeId}
                          className={`inline-flex w-max items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                            isPilot ? 'bg-blue-100 text-blue-700' : plan.comingSoon ? 'bg-white/60 text-slate-500' : 'bg-white/85 text-slate-600'
                          }`}
            >
              {plan.badge}
            </span>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{plan.price}</p>
                        <p className="text-sm text-slate-600">{plan.description}</p>
                      </div>
                      <ul className="space-y-3 text-sm text-slate-700">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className={`mt-[2px] h-4 w-4 ${iconColor}`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <ApplyButton
                        source={`pricing-${plan.intent}`}
                        plan={plan.intent}
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${ctaClasses} ${
                          plan.comingSoon ? 'pointer-events-none opacity-70' : ''
                        }`}
                        aria-describedby={plan.badge ? badgeId : undefined}
                        disabled={plan.comingSoon}
                      >
                        {plan.cta}
                      </ApplyButton>
                    </div>
                  </Card>
                );
              })}
            </CardSwap>
        </div>
        </div>
        <div className="mt-10 grid gap-6 md:hidden">
          {pricingPlans.map((plan) => {
            const isPilot = plan.highlight && !plan.comingSoon;
            return (
              <div
                key={plan.name}
                className={`paper-sheet flex h-full flex-col gap-5 p-6 ${
                  isPilot ? 'border-blue-300 bg-blue-50 shadow-[0_30px_60px_rgba(59,130,246,0.25)]' : ''
                }`}
              >
                {plan.badge && (
                  <span className={`inline-flex w-max items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                    isPilot ? 'bg-blue-100 text-blue-700' : 'bg-white/60 text-slate-500'
                  }`}>
                    {plan.badge}
                  </span>
                )}
        <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{plan.price}</p>
                  <p className="text-sm text-slate-600">{plan.description}</p>
        </div>
                <ul className="space-y-3 text-sm text-slate-700">
          {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className={`mt-[2px] h-4 w-4 ${isPilot ? 'text-emerald-500' : 'text-blue-500'}`} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
          <ApplyButton
            source={`pricing-${plan.intent}`}
            plan={plan.intent}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isPilot
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'border border-slate-300 text-slate-900 hover:border-slate-600'
                  } ${plan.comingSoon ? 'pointer-events-none opacity-70' : ''}`}
                  disabled={plan.comingSoon}
          >
            {plan.cta}
          </ApplyButton>
        </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

