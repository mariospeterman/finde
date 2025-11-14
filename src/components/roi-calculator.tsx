'use client';

import { useEffect, useId, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  intent?: string;
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
  const [usageWeeks, setUsageWeeks] = useState(48);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id ?? "");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  
  // Mobile dropdown states
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['inputs']));
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // On mobile, start with inputs open, results closed
      if (window.innerWidth < 768) {
        setOpenSections(new Set(['inputs']));
      } else {
        setOpenSections(new Set(['inputs', 'results']));
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const plan = useMemo(() => {
    return plans.find((entry) => entry.id === selectedPlanId) ?? plans[0] ?? { id: "", name: "Unknown", maxTeamSize: null, monthlySeatPrice: 0 };
  }, [plans, selectedPlanId]);

  const calculatorId = useId();
  const hourlyHintId = `${calculatorId}-hourly-hint`;
  const teamHintId = `${calculatorId}-team-hint`;
  const hoursHintId = `${calculatorId}-hours-hint`;
  const weeksHintId = `${calculatorId}-weeks-hint`;
  const resultsId = `${calculatorId}-results`;

  const calculations = useMemo(() => {
    const MONTHS_PER_YEAR = 12;
    const WORK_DAYS_PER_WEEK = 5;
    const annualValue = hourlyRate * hoursSaved * teamSize * usageWeeks;
    const monthlyValue = annualValue / MONTHS_PER_YEAR;
    const monthlyCost = plan.monthlySeatPrice * teamSize;
    const monthlyNet = monthlyValue - monthlyCost;
    const annualCost = monthlyCost * MONTHS_PER_YEAR;
    const annualNet = annualValue - annualCost;
    const roi = annualCost > 0 ? (annualNet / annualCost) * 100 : 0;
    const paybackMonths = monthlyNet > 0 ? Math.max(1, Math.ceil(annualCost / monthlyNet)) : null;

    const dailyValue = annualValue / (usageWeeks * WORK_DAYS_PER_WEEK || 1);

    return { monthlyValue, monthlyCost, monthlyNet, annualValue, annualCost, annualNet, roi, paybackMonths, dailyValue };
  }, [hourlyRate, hoursSaved, teamSize, plan, usageWeeks]);

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
    if (plan.monthlySeatPrice === 0) {
      tips.push("The Pilot Program is free. Convert within 60 days to apply pilot credit to your first paid licence.");
    }
    return tips;
  }, [calculations.monthlyNet, plan]);

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby={`${calculatorId}-heading`}>
      <div className="space-y-4">
        <h3 id={`${calculatorId}-heading`} className="font-display text-3xl text-slate-900 md:text-4xl">
          Your ROI calculator
        </h3>
        <p className="text-base text-slate-600">
          Pilot data shows teams reclaim 25–40% of search time. Model what that relief looks like with your numbers.
        </p>
        
        {/* Mobile: Collapsible Input Section */}
        {isMobile ? (
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('inputs')}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
              aria-expanded={openSections.has('inputs')}
              aria-controls={`${calculatorId}-inputs`}
            >
              <span className="text-sm font-semibold text-slate-900">Input Settings</span>
              {openSections.has('inputs') ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </button>
            {openSections.has('inputs') && (
              <div id={`${calculatorId}-inputs`} className="p-4 border-t border-slate-200">
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
                          setUsageWeeks(48);
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
                  <div className="space-y-4">
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
                    <div>
                      <label
                        htmlFor={`${calculatorId}-usageWeeks`}
                        className="text-xs uppercase tracking-[0.3em] text-slate-500"
                        title="Weeks per year your teams actively use Finde (assumes 5-day work weeks)."
                      >
                        Active weeks per year
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        name="usageWeeks"
                        id={`${calculatorId}-usageWeeks`}
                        min={4}
                        max={52}
                        value={usageWeeks}
                        aria-describedby={weeksHintId}
                        onChange={(event) => setUsageWeeks(clamp(Number(event.target.value), 4, 52))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
                      />
                      <p id={weeksHintId} className="mt-2 text-xs text-slate-500">
                        Most pilots run 48 weeks per year (accounting for holidays). Adjust if you plan for shorter engagements.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
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
                    setUsageWeeks(48);
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
          <div>
            <label
              htmlFor={`${calculatorId}-plan`}
              className="text-xs uppercase tracking-[0.3em] text-slate-500"
              title="Select the pricing tier to calculate ROI for."
            >
              Pricing tier
            </label>
            <select
              id={`${calculatorId}-plan`}
              name="plan"
              value={selectedPlanId}
              onChange={(event) => {
                setSelectedPlanId(event.target.value);
              }}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              {plans.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">
              Select the pricing tier that matches your planned deployment model.
            </p>
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
            <div>
              <label
                htmlFor={`${calculatorId}-usageWeeks`}
                className="text-xs uppercase tracking-[0.3em] text-slate-500"
                title="Weeks per year your teams actively use Finde (assumes 5-day work weeks)."
              >
                Active weeks per year
              </label>
              <input
                type="number"
                inputMode="numeric"
                name="usageWeeks"
                id={`${calculatorId}-usageWeeks`}
                min={4}
                max={52}
                value={usageWeeks}
                aria-describedby={weeksHintId}
                onChange={(event) => setUsageWeeks(clamp(Number(event.target.value), 4, 52))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm transition focus:border-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              />
              <p id={weeksHintId} className="mt-2 text-xs text-slate-500">
                Most pilots run 48 weeks per year (accounting for holidays). Adjust if you plan for shorter engagements.
              </p>
            </div>
          </div>
        </form>
        )}
      </div>

      {/* Mobile: Collapsible Results Section */}
      {isMobile ? (
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('results')}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
            aria-expanded={openSections.has('results')}
            aria-controls={`${calculatorId}-results`}
          >
            <span className="text-sm font-semibold text-slate-900">ROI Results</span>
            {openSections.has('results') ? (
              <ChevronUp className="h-5 w-5 text-slate-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-500" />
            )}
          </button>
          {openSections.has('results') && (
            <div
              id={`${calculatorId}-results`}
              className="rounded-3xl border-t border-slate-100 bg-white/80 p-6 shadow-sm"
              aria-live={prefersReducedMotion ? "off" : "polite"}
              aria-atomic="true"
              role="status"
              data-testid="roi-results"
            >
              <RoiResultsContent calculations={calculations} plan={plan} usageWeeks={usageWeeks} advice={advice} formatCurrency={formatCurrency} formatPercent={formatPercent} />
            </div>
          )}
        </div>
      ) : (
        <div
          className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm"
          aria-live={prefersReducedMotion ? "off" : "polite"}
          aria-atomic="true"
          role="status"
          id={resultsId}
          data-testid="roi-results"
        >
          <RoiResultsContent calculations={calculations} plan={plan} usageWeeks={usageWeeks} advice={advice} formatCurrency={formatCurrency} formatPercent={formatPercent} />
        </div>
      )}
    </div>
  );
}

type Calculations = {
  monthlyValue: number;
  monthlyCost: number;
  monthlyNet: number;
  annualValue: number;
  annualCost: number;
  annualNet: number;
  roi: number;
  paybackMonths: number | null;
  dailyValue: number;
};

function RoiResultsContent({
  calculations,
  plan,
  usageWeeks,
  advice,
  formatCurrency,
  formatPercent,
}: {
  calculations: Calculations;
  plan: RoiPlanThreshold;
  usageWeeks: number;
  advice: string[];
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}) {
  return (
    <>
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
          <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Value per workday</dt>
            <dd className="mt-1 font-semibold text-slate-900">{formatCurrency(calculations.dailyValue)}</dd>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-3">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">Active weeks</dt>
            <dd className="mt-1 font-semibold text-slate-900">{usageWeeks} weeks/year</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-slate-500">
          Assumes 5-day work weeks and four working weeks per month. Pilot conversions within 60 days receive licence credit and onboarding
          support.
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
    </>
  );
}


