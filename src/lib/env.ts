const stringWithFallback = (value: string | undefined, fallback: string) =>
  typeof value === "string" && value.length > 0 ? value : fallback;

const numberWithFallback = (value: string | undefined, fallback: number) => {
  if (typeof value !== "string") {
    return fallback;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const deriveRoiPricing = (managedSeatMonthly: number, hybridSeatMonthly: number) => {
  const starter = managedSeatMonthly > 0 ? managedSeatMonthly : Math.max(149, Math.round(hybridSeatMonthly / 3));
  const growth = Math.max(Math.round(starter * 1.5), starter + 80);
  const enterpriseCandidate =
    hybridSeatMonthly > 0 ? Math.round(hybridSeatMonthly) : Math.max(Math.round(starter * 3), growth + 400);
  const enterprise = enterpriseCandidate >= growth + 200 ? enterpriseCandidate : growth + 200;

  return {
    starter,
    growth,
    enterprise,
  };
};

const pricing = {
  pilotLabel: stringWithFallback(process.env.NEXT_PUBLIC_PRICING_PILOT_LABEL, "Free · Limited seats"),
  selfHosted: {
    seatAnnual: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_SELF_HOSTED_ANNUAL_SEAT, 0),
    seatMonthly: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_SELF_HOSTED_MONTHLY_SEAT, 0),
    setupFee: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_SELF_HOSTED_SETUP, 0),
  },
  hybrid: {
    seatAnnual: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_HYBRID_ANNUAL_SEAT, 0),
    seatMonthly: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_HYBRID_MONTHLY_SEAT, 0),
    gpuHourly: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_HYBRID_GPU_HOURLY, 0),
    setupFee: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_HYBRID_SETUP, 0),
  },
  managed: {
    seatAnnual: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_MANAGED_ANNUAL_SEAT, 0),
    seatMonthly: numberWithFallback(process.env.NEXT_PUBLIC_PRICING_MANAGED_MONTHLY_SEAT, 0),
  },
} as const;

const defaultPricing = numberWithFallback(
  process.env.NEXT_PUBLIC_DEFAULT_PRICING,
  pricing.managed.seatMonthly > 0
    ? pricing.managed.seatMonthly
    : pricing.selfHosted.seatMonthly > 0
      ? pricing.selfHosted.seatMonthly
      : pricing.selfHosted.seatAnnual > 0
        ? Math.round(pricing.selfHosted.seatAnnual / 12)
        : Math.round(Math.max(pricing.hybrid.seatMonthly / 3, 0)),
);

const roiPricing = deriveRoiPricing(defaultPricing || pricing.managed.seatMonthly, pricing.hybrid.seatMonthly);

export const publicEnv = {
  brandName: stringWithFallback(process.env.NEXT_PUBLIC_BRAND_NAME, "Finde"),
  slogan: stringWithFallback(process.env.NEXT_PUBLIC_SLOGAN, "Search. Decide. Deliver."),
  defaultPricing,
  tiresOffer: stringWithFallback(process.env.NEXT_PUBLIC_TIRES_OFFER, "20% Off Installation"),
  typeformUrl: stringWithFallback(process.env.NEXT_PUBLIC_TYPEFORM_URL, ""),
  posthogKey: stringWithFallback(process.env.NEXT_PUBLIC_POSTHOG_KEY, ""),
  posthogHost: stringWithFallback(process.env.NEXT_PUBLIC_POSTHOG_API_HOST, "https://app.posthog.com"),
  contactEmail: stringWithFallback(process.env.NEXT_PUBLIC_CONTACT_EMAIL, "hello@finde.info"),
  linkedin: {
    url: stringWithFallback(process.env.NEXT_PUBLIC_LINKEDIN_URL, "https://www.linkedin.com/company/finde"),
    label: stringWithFallback(process.env.NEXT_PUBLIC_LINKEDIN_LABEL, "Connect on LinkedIn"),
  },
  pricing,
  roiPricing,
} as const;

const warn = (message: string) => {
  if (process.env.NODE_ENV === "production") return;
  if (typeof console !== "undefined") {
    console.warn(`[env] ${message}`);
  }
};

const validatePricing = () => {
  const seatValues = [
    publicEnv.pricing.managed.seatMonthly,
    publicEnv.pricing.hybrid.seatMonthly,
    publicEnv.pricing.selfHosted.seatMonthly,
    publicEnv.pricing.selfHosted.seatAnnual > 0 ? Math.round(publicEnv.pricing.selfHosted.seatAnnual / 12) : 0,
  ].filter((value) => value > 0);

  if (seatValues.some((value) => Number.isNaN(value) || value < 0)) {
    warn("Seat pricing contains negative or NaN values. Check NEXT_PUBLIC_PRICING_* environment variables.");
  }

  if (publicEnv.pricing.hybrid.gpuHourly < 0) {
    warn("NEXT_PUBLIC_PRICING_HYBRID_GPU_HOURLY should be zero or positive.");
  }

  const { starter, growth, enterprise } = publicEnv.roiPricing;
  if (!(starter <= growth && growth <= enterprise)) {
    warn(
      `ROI tiers should be ascending (starter ≤ growth ≤ enterprise). Received starter=${starter}, growth=${growth}, enterprise=${enterprise}.`,
    );
  }
};

try {
  validatePricing();
} catch (error) {
  warn(`Failed to validate pricing env: ${(error as Error).message}`);
}
