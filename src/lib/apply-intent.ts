'use client';

import { useEffect } from "react";

export type ApplyIntent = {
  source: string;
  plan?: string;
};

const APPLY_EVENT = "finde-apply-intent";

export const emitApplyIntent = (intent: ApplyIntent) => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent<ApplyIntent>(APPLY_EVENT, { detail: intent }));
};

export const useApplyIntent = (listener: (intent: ApplyIntent) => void) => {
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ApplyIntent>;
      if (customEvent.detail) {
        listener(customEvent.detail);
      }
    };

    window.addEventListener(APPLY_EVENT, handler);
    return () => {
      window.removeEventListener(APPLY_EVENT, handler);
    };
  }, [listener]);
};

