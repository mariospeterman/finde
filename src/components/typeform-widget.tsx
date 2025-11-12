'use client';

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";

import { useApplyIntent } from "@/lib/apply-intent";
import { useSearchParams } from "next/navigation";

type TypeformWidgetProps = {
  id: string;
  hidden?: Record<string, string>;
  style?: CSSProperties;
  className?: string;
};

const TypeformWidget = dynamic<TypeformWidgetProps>(
  () => import("@typeform/embed-react").then((mod) => mod.Widget),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] w-full items-center justify-center rounded-3xl border border-slate-200 bg-slate-100" aria-hidden>
        <span className="text-sm font-medium text-slate-500">Preparing the Typeform…</span>
      </div>
    ),
  },
);

type TypeformModalProps = {
  url: string;
  hidden?: Record<string, string>;
};

export function TypeformModal({ url, hidden }: TypeformModalProps) {
  const baseHidden = useMemo(() => hidden ?? {}, [hidden]);
  const [extraHidden, setExtraHidden] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const searchParams = useSearchParams();
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const extractId = useCallback((value: string) => {
    try {
      const parsed = new URL(value);
      const segments = parsed.pathname.split("/").filter(Boolean);
      return segments.pop() ?? value;
    } catch {
      return value;
    }
  }, []);

  const widgetId = useMemo(() => extractId(url), [extractId, url]);

  const utmHidden = useMemo(() => {
    if (!searchParams) return {};
    const utm: Record<string, string> = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => {
      const value = searchParams.get(key);
      if (value) utm[key] = value;
    });
    const ref = searchParams.get("ref");
    if (ref) utm.ref = ref;
    return utm;
  }, [searchParams]);

  const hiddenFields = useMemo(
    () => ({
      ...baseHidden,
      ...utmHidden,
      ...extraHidden,
    }),
    [baseHidden, utmHidden, extraHidden],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useApplyIntent((intent) => {
    setExtraHidden((current) => ({
      ...current,
      source: intent.source,
      ...(intent.plan ? { plan: intent.plan } : {}),
    }));
    setShouldRender(true);
    lastFocusedElement.current = (document.activeElement as HTMLElement) ?? null;
    setIsOpen(true);
  });

  useEffect(() => {
    if (!isOpen) {
      if (typeof document !== "undefined") {
        document.body.style.removeProperty("overflow");
      }
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
      return;
    }

    if (typeof document !== "undefined") {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [isOpen]);

  if (!url || typeof document === "undefined") {
    return null;
  }

  const modal = !isOpen
    ? null
    : createPortal(
        <div
          className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/70 px-4 py-10 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="typeform-modal-title"
        >
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8">
              <h2 id="typeform-modal-title" className="text-lg font-semibold text-slate-900">
                Join the pilot
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-slate-500 transition hover:border-slate-200 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                aria-label="Close application form"
              >
                ×
              </button>
            </div>
            <Suspense
              fallback={
                <div className="flex h-[520px] w-full items-center justify-center bg-slate-50 text-sm text-slate-500">
                  Loading application form…
                </div>
              }
            >
              {shouldRender ? (
                <TypeformWidget
                  id={widgetId}
                  hidden={hiddenFields}
                  style={{ height: 520 }}
                  className="bg-transparent"
                />
              ) : null}
            </Suspense>
          </div>
        </div>,
        document.body,
      );

  return modal;
}
