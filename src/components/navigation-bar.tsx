'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { navItems } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { emitApplyIntent } from "@/lib/apply-intent";

const MOBILE_MENU_ID = "mobile-navigation";

type PrimaryLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

const collectPrimaryLinks = (): PrimaryLink[] => {
  const lookup = new Map<string, PrimaryLink>();
  navItems.forEach((item) => {
    (item.links ?? []).forEach((link) => {
      if (!lookup.has(link.href)) {
        lookup.set(link.href, link);
      }
    });
  });
  return Array.from(lookup.values());
};

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const primaryLinks = useMemo(() => collectPrimaryLinks(), []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 pb-4 sm:pb-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-slate-200 bg-white/85 px-4 py-2.5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/70 sm:px-6">
        <div className="flex flex-1 items-center gap-4 sm:gap-6">
          <Link
            href="#hero"
            className="flex items-center"
            aria-label={`${publicEnv.brandName} homepage`}
          >
            <Image src="/logo.png" alt={`${publicEnv.brandName} logo`} width={110} height={28} priority />
          </Link>
          <nav className="hidden items-center gap-5 lg:gap-6 md:flex" aria-label="Primary navigation">
            {primaryLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-label={link.ariaLabel}
                className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-slate-300 focus-visible:outline-offset-2"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => emitApplyIntent({ source: "nav-cta", plan: "pilot-program" })}
            className="hidden min-h-[40px] rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-slate-300 focus-visible:outline-offset-2 md:inline"
          >
            Apply now
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:hidden"
            aria-controls={MOBILE_MENU_ID}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleMenu}
          >
            <span className="sr-only">{isMenuOpen ? "Close navigation menu" : "Open navigation menu"}</span>
            <span className="flex items-center gap-1">
              {[0, 1, 2].map((dot) => (
                <span key={dot} className="h-1.5 w-1.5 rounded-full bg-current" />
              ))}
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id={MOBILE_MENU_ID}
          className="fixed inset-0 z-40 flex flex-col bg-white px-6 py-16 text-slate-900 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{publicEnv.brandName}</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              ×
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-6 text-lg font-semibold">
            {primaryLinks.map((link) => (
              <a key={link.href} href={link.href} aria-label={link.ariaLabel} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-700"
              onClick={() => {
                emitApplyIntent({ source: "mobile-nav-cta", plan: "pilot-program" });
                closeMenu();
              }}
            >
              Apply now
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
