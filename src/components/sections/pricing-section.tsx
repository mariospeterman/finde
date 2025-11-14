'use client';

import { Check } from "lucide-react";

import { pricingPlans } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { ApplyButton } from "@/components/apply-button";
import { CardSwap, Card } from "@/components/card-swap";

const DESKTOP_CARD_DIMENSIONS = {
  width: 380,
  height: 460,
};

export function PricingSection() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="space-y-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="space-y-4 lg:max-w-2xl">
          <h2 id="pricing-heading" className="font-display text-3xl text-slate-900 md:text-4xl">
            Pricing for teams who already own the answers.
          </h2>
          <p className="text-base text-slate-600">
            High-trust knowledge deserves high-trust deployment. We are currently onboarding pilot teams; paid licences open soon.
            Choose the pilot today and reserve your spot in the plan that fits your scale.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-center lg:gap-14">
          <div className="space-y-6 lg:self-stretch lg:pr-10">
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
                <Check className="mt-[4px] h-4 w-4 shrink-0 text-emerald-500" />
                Free setup (3–6 weeks) with relevance workshops, audit logs and KPI tracking included.
              </li>
              <li className="flex gap-3">
                <Check className="mt-[4px] h-4 w-4 shrink-0 text-emerald-500" />
                Decide on self-hosted, hybrid GPU or managed cloud once your team experiences the pilot.
              </li>
              <li className="flex gap-3">
                <Check className="mt-[4px] h-4 w-4 shrink-0 text-emerald-500" />
                Convert within 60 days and the pilot credit rolls into your first licence.
              </li>
            </ul>
          </div>

          <div className="hidden justify-end md:flex">
            <CardSwap
              width={DESKTOP_CARD_DIMENSIONS.width}
              height={DESKTOP_CARD_DIMENSIONS.height}
              cardDistance={56}
              verticalDistance={68}
              delay={0}
              pauseOnHover={false}
              className="w-full max-w-[420px]"
            >
              {pricingPlans.map((plan) => {
                const isPilot = plan.highlight && !plan.comingSoon;
                const cardAccent = isPilot
                  ? "border-blue-200 bg-blue-50/70"
                  : plan.comingSoon
                    ? "border-slate-200 bg-white/85"
                    : "border-slate-200 bg-white";
                const iconColor = isPilot ? "text-emerald-500" : "text-blue-500";
                const ctaClasses = isPilot
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200/40 hover:bg-blue-500"
                  : "border border-slate-200 text-slate-900 hover:border-slate-400";
    const badgeId = `${plan.name}-badge`;

    return (
                  <Card key={plan.name} className={`flex h-full min-h-[420px] flex-col justify-between border p-8 ${cardAccent}`}>
                    <div className="flex flex-1 flex-col gap-4 text-left">
          {plan.badge ? (
            <span
              id={badgeId}
                          className={`inline-flex w-max items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                            isPilot ? "bg-blue-100 text-blue-700" : plan.comingSoon ? "bg-white/60 text-slate-500" : "bg-white/85 text-slate-600"
                          }`}
            >
              {plan.badge}
            </span>
                      ) : null}

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
                    </div>

          <ApplyButton
            source={`pricing-${plan.intent}`}
            plan={plan.intent}
                      className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ctaClasses} ${
                        plan.comingSoon ? "pointer-events-none opacity-70" : ""
                      }`}
            aria-describedby={plan.badge ? badgeId : undefined}
                      disabled={plan.comingSoon}
          >
            {plan.cta}
          </ApplyButton>
                  </Card>
                );
              })}
            </CardSwap>
          </div>
        </div>

        <div className="-mx-4 w-full md:hidden sm:mx-0">
          <CardSwap
            width="100%"
            height={520}
            cardDistance={28}
            verticalDistance={35}
            delay={0}
            pauseOnHover={false}
            className="px-4"
          >
            {pricingPlans.map((plan) => {
              const isPilot = plan.highlight && !plan.comingSoon;
              const cardAccent = isPilot
                ? "border-blue-200 bg-blue-50/70"
                : plan.comingSoon
                  ? "border-slate-200 bg-white/85"
                  : "border-slate-200 bg-white";
              const iconColor = isPilot ? "text-emerald-500" : "text-blue-500";
              const ctaClasses = isPilot
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200/40 hover:bg-blue-500"
                : "border border-slate-200 text-slate-900 hover:border-slate-400";
              const badgeId = `${plan.name}-badge`;

  return (
                <Card key={plan.name} className={`flex h-full w-full max-w-[calc(100%-1.5rem)] flex-col gap-4 border p-6 text-left ${cardAccent}`}>
                  {plan.badge ? (
                    <span
                      id={badgeId}
                      className={`inline-flex w-max items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                        isPilot ? "bg-blue-100 text-blue-700" : plan.comingSoon ? "bg-white/60 text-slate-500" : "bg-white/85 text-slate-600"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  ) : null}

                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-slate-900">{plan.name}</h3>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{plan.price}</p>
                    <p className="text-sm text-slate-600">{plan.description}</p>
                  </div>

                  <ul className="flex-1 space-y-3 overflow-y-auto text-sm text-slate-700">
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
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold ${ctaClasses} ${
                      plan.comingSoon ? "pointer-events-none opacity-70" : ""
                    }`}
                    aria-describedby={plan.badge ? badgeId : undefined}
                    disabled={plan.comingSoon}
                  >
                    {plan.cta}
                  </ApplyButton>
                </Card>
              );
            })}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}
