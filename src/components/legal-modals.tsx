'use client';

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type LegalKey = "privacy" | "terms" | "imprint";

export type LegalContent = Record<
  LegalKey,
  {
    title: string;
    body: string;
  }
>;

type LegalModalsProps = {
  content: LegalContent;
};

export function LegalModals({ content }: LegalModalsProps) {
  const [activeModal, setActiveModal] = useState<LegalKey | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => setActiveModal(null);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (!activeModal) {
      return undefined;
    }

    lastFocusedElement.current = (document.activeElement as HTMLElement) ?? null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.cancelAnimationFrame(frame);
      lastFocusedElement.current?.focus();
    };
  }, [activeModal]);

  const modal =
    typeof document !== "undefined" && activeModal
      ? createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 px-4 py-10 backdrop-blur-sm"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            aria-describedby="legal-modal-body"
          >
            <div
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-[0_25px_70px_-20px_rgba(15,23,42,.45)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8 sm:py-5">
                <h3 id="legal-modal-title" className="text-lg font-semibold text-slate-900">
                  {content[activeModal]?.title ?? "Legal"}
                </h3>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:border-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                  aria-label="Close legal content"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div id="legal-modal-body" className="max-h-[70vh] overflow-y-auto px-6 py-5 sm:px-8">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {content[activeModal]?.body ?? "Content will be available soon."}
                </p>
              </div>
              <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Legal</h3>
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          <li>
            <button type="button" onClick={() => setActiveModal("privacy")} className="hover:text-slate-900">
              Privacy Policy
            </button>
          </li>
          <li>
            <button type="button" onClick={() => setActiveModal("terms")} className="hover:text-slate-900">
              Terms of Use
            </button>
          </li>
          <li>
            <button type="button" onClick={() => setActiveModal("imprint")} className="hover:text-slate-900">
              Imprint
            </button>
          </li>
        </ul>
      </div>
      {modal}
    </>
  );
}
