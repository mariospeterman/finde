import posthog from "posthog-js";

import { publicEnv } from "./env";

let isInitialised = false;

const canUseAnalytics = () => typeof window !== "undefined" && !!publicEnv.posthogKey;

export const initAnalytics = () => {
  if (!canUseAnalytics()) {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.warn("PostHog API key is not configured.");
    }
    return;
  }

  if (!isInitialised) {
    posthog.init(publicEnv.posthogKey, {
      api_host: publicEnv.posthogHost,
      capture_pageview: false,
    });
    isInitialised = true;
  } else {
    posthog.opt_in_capturing?.();
  }
};

export const disableAnalytics = () => {
  if (!canUseAnalytics()) return;
  if (isInitialised) {
    posthog.opt_out_capturing?.();
    posthog.shutdown?.();
    isInitialised = false;
  }
};

export const captureEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (!isInitialised) return;
  posthog.capture(eventName, properties);
};

export const capturePageview = (properties?: Record<string, unknown>) => {
  if (!isInitialised) return;
  posthog.capture("$pageview", properties);
};
