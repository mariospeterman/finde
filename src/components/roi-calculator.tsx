'use client';

import { useEffect, useId, useMemo, useState } from "react";

export type IndustryPreset = {
  id: string;
  label: string;
  hourlyRate: number;
  hoursSaved: number;
};

export type RoiPlanThreshold = {
  id: string;
  name: string;
  maxTeamSize: number | null;
  monthlySeatPrice: number;
};

type RoiCalculatorProps = {
  industries: IndustryPreset[];
  plans: RoiPlanThreshold[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

const formatPercent = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 }).format(value / 100);

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(Number.isFinite(value) ? value : min, min), max);

export function RoiCalculator({ industries, plans }: RoiCalculatorProps) {
  const [industryId, setIndustryId] = useState(industries[0]?.id ?? "");
  const activeIndustry = useMemo(
    () => industries.find((entry) => entry.id === industryId) ?? industries[0],
    [industries, industryId],
  );

  const [hourlyRate, setHourlyRate] = useState(activeIndustry?.hourlyRate ?? 120);
  const [teamSize, setTeamSize] = useState(12);
  const [hoursSaved, setHoursSaved] = useState(activeIndustry?.hoursSaved ?? 6);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const plan = useMemo(() => {
    const ordered = plans.slice().sort((a, b) => {
      const maxA = a.maxTeamSize ?? Number.POSITIVE_INFINITY;
      const maxB = b.maxTeamSize ?? Number.POSITIVE_INFINITY;
      return maxA - maxB;
    });

    return (
      ordered.find((entry) => !entry.maxTeamSize || teamSize <= entry.maxTeamSize) ?? ordered[ordered.length - 1] ?? plans[0]
    );
  }, [plans, teamSize]);

  const calculatorId = useId();
  const hourlyHintId = `${calculatorId}-hourly-hint`;
  const teamHintId = `${calculatorId}-team-hint`;
  const hoursHintId = `${calculatorId}-hours-hint`;
  const resultsId = `${calculatorId}-results`;

  const calculations = useMemo(() => {
    const WORK_WEEKS_PER_MONTH = 4;
    const MONTHS_PER_YEAR = 12;

    const monthlyValue = hourlyRate * hoursSaved * teamSize * WORK_WEEKS_PER_MONTH;
    const monthlyCost = plan.monthlySeatPrice * teamSize;
    const monthlyNet = monthlyValue - monthlyCost;
    const annualValue = monthlyValue * MONTHS_PER_YEAR;
    const annualCost = monthlyCost * MONTHS_PER_YEAR;
    const annualNet = annualValue - annualCost;
    const roi = annualCost > 0 ? (annualNet / annualCost) * 100 : 0;
    const paybackMonths = monthlyNet > 0 ? Math.max(1, Math.ceil(annualCost / monthlyNet)) : null;

    return { monthlyValue, monthlyCost, monthlyNet, annualValue, annualCost, annualNet, roi, paybackMonths };
  }, [hourlyRate, hoursSaved, teamSize, plan]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const advice: string[] = useMemo(() => {
    const tips: string[] = [];
    if (calculations.monthlyNet <= 0) {
      tips.push("Increase weekly hours saved or adjust team size until the monthly gain exceeds licence cost.");
    }
    if (plan.maxTeamSize && teamSize > plan.maxTeamSize) {
      tips.push(`Consider upgrading beyond the ${plan.name} tier once your team exceeds ${plan.maxTeamSize} seats.`);
    }
    return tips;
  }, [calculations.monthlyNet, plan, teamSize]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby={`${calculatorId}-heading`}>
      <div className="space-y-4">
        <h3 id={`${calculatorId}-heading`} className="font-display text-3xl text-slate-900 md:text-4xl">
          Your ROI calculator
        </h3>
        <p className="text-base text-slate-600">
          Pilot data shows teams reclaim 25–40% of search time. Model what that relief looks like with your numbers.
        </p>
        <form className="space-y-4" aria-describedby={`${calculatorId}-form-hint`}>
          <p id={`${calculatorId}-form-hint`} className="text-sm text-slate-500">
            Update assumptions to see how licence size, team composition, and reclaimed hours impact your projected return.
          </p>
          <div>
            <label
              htmlFor={`${calculatorId}-industry`}
              className="text-xs uppercase tracking-[0.3em] text-slate-500"
              title="Preset blends of hourly rate and reclaimed hours for each department."
            >
              Industry focus
            </label>
            <select
              id={`${calculatorId}-industry`}
              name="industry"
              value={industryId}
              onChange={(event) => {
                const nextId = event.target.value;
                setIndustryId(nextId);
                const preset = industries.find((entry) => entry.id === nextId);
                if (preset) {
                  setHourlyRate(preset.hourlyRate);
                  setHoursSaved(preset.hoursSaved);
                }
              }}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {industries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor={`${calculatorId}-hourlyRate`}
                className="text-xs uppercase tracking-[0.3em] text-slate-500"
                title="Average fully loaded hourly rate for teammates benefiting from faster answers."
              >
                Hourly rate (€)
              </label>
              <input
                type="number"
                inputMode="decimal"
                name="hourlyRate"
                id={`${calculatorId}-hourlyRate`}
                min={20}
                max={2000}
                step={5}
                value={hourlyRate}
                aria-describedby={hourlyHintId}
                onChange={(event) => setHourlyRate(clamp(Number(event.target.value), 20, 2000))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
              <p id={hourlyHintId} className="mt-2 text-xs text-slate-500">
                Start with the blended hourly rate for the team benefiting from faster answers.
              </p>
            </div>
            <div>
              <label
                htmlFor={`${calculatorId}-teamSize`}
                className="text-xs uppercase tracking-[0.3em] text-slate-500"
                title="Number of active knowledge workers with access to Finde."
              >
                Team size
              </label>
              <input
                type="number"
                inputMode="numeric"
                name="teamSize"
                id={`${calculatorId}-teamSize`}
                min={1}
                max={1000}
                value={teamSize}
                aria-describedby={teamHintId}
                onChange={(event) => setTeamSize(clamp(Number(event.target.value), 1, 1000))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
              <p id={teamHintId} className="mt-2 text-xs text-slate-500">
                Include everyone who needs precise knowledge retrieval—consultants, HR partners, compliance, and ops.
              </p>
            </div>
            <div>
              <label
                htmlFor={`${calculatorId}-hoursSaved`}
                className="text-xs uppercase tracking-[0.3em] text-slate-500"
                title="Weekly hours each teammate reclaims with faster search and confident answers."
              >
                Weekly hours saved
              </label>
              <input
                type="number"
                inputMode="decimal"
                name="hoursSaved"
                id={`${calculatorId}-hoursSaved`}
                min={1}
                max={60}
                step={0.5}
                value={hoursSaved}
                aria-describedby={hoursHintId}
                onChange={(event) => setHoursSaved(clamp(Number(event.target.value), 1, 60))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
              <p id={hoursHintId} className="mt-2 text-xs text-slate-500">
                How many hours per teammate move from searching to delivering outcomes every week?
              </p>
            </div>
          </div>
        </form>
      </div>

      <div
        className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm"
        aria-live={prefersReducedMotion ? "off" : "polite"}
        aria-atomic="true"
        role="status"
        id={resultsId}
        data-testid="roi-results"
      >
        <div className="grid gap-6 text-center sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Annual time value</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(calculations.annualValue)}</p>
            <p className="mt-1 text-xs text-slate-500">Based on reclaimed hours</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimated annual licence</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(calculations.annualCost)}</p>
            <p className="mt-1 text-xs text-slate-500">Aligned to the {plan.name} tier</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 rounded-2xl bg-white p-5 text-center shadow-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Net annual gain</p>
            <p className={`mt-2 text-3xl font-semibold ${calculations.annualNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {formatCurrency(calculations.annualNet)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Projected ROI</p>
            <p className={`mt-2 text-3xl font-semibold ${calculations.roi >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {calculations.annualCost === 0 ? "–" : formatPercent(calculations.roi)}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2" aria-label="Additional ROI metrics">
          <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Monthly net impact</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatCurrency(calculations.monthlyNet)}</dd>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Payback period</dt>
            <dd className="mt-1 font-semibold text-slate-900">
              {calculations.paybackMonths ? `${calculations.paybackMonths} month${calculations.paybackMonths > 1 ? "s" : ""}` : "—"}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-slate-500">
          Assumes four working weeks (20 business days) per month. Pilot conversions within 60 days receive licence credit and onboarding support.
        </p>
        {advice.length ? (
          <ul className="mt-4 space-y-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            {advice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        <span className="sr-only">
          With your inputs the projected ROI is {formatPercent(calculations.roi)} and the payback period is{" "}
          {calculations.paybackMonths ? `${calculations.paybackMonths} months.` : "not reached with the current inputs."}
        </span>
      </div>
    </div>
  );
}


