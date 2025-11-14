'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";

import { navItems } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { ApplyButton } from "@/components/apply-button";

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
  const [isSticky, setIsSticky] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const chatDemo = document.querySelector('[data-chat-demo]');
    if (!chatDemo || !headerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When chat demo enters viewport, make header non-sticky
          setIsSticky(!entry.isIntersecting);
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50% 0px' // Trigger when chat demo reaches middle of viewport
      }
    );

    observer.observe(chatDemo);

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      ref={headerRef}
      className={`${isSticky ? 'sticky' : 'relative'} top-0 z-50 pb-3 sm:pb-5 transition-all duration-300`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 rounded-[2.75rem] border border-slate-200/70 bg-white/92 px-4 py-2 shadow-sm backdrop-blur">
        <div className="flex flex-1 items-center justify-start gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
            aria-controls={MOBILE_MENU_ID}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleMenu}
          >
            <span className="sr-only">{isMenuOpen ? "Close navigation menu" : "Open navigation menu"}</span>
            <span className="flex flex-col gap-1.5">
              {[0, 1, 2].map((line) => (
                <span key={line} className="h-0.5 w-5 rounded-full bg-current" />
              ))}
            </span>
          </button>
          <Link
            href="#hero"
            className="flex flex-1 items-center justify-center md:justify-start"
            aria-label={`${publicEnv.brandName} homepage`}
          >
            <Image src="/logo.png" alt={`${publicEnv.brandName} logo`} width={104} height={26} priority />
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-label={link.ariaLabel}
              className="text-sm font-semibold text-slate-900 underline-offset-4 focus-visible:outline focus-visible:outline-blue-200 focus-visible:outline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end">
          <ApplyButton
            source="nav-cta"
            plan="pilot-program"
            className="min-h-[36px] rounded-full border border-slate-300 bg-transparent px-4 text-xs font-semibold uppercase tracking-[0.26em] text-slate-900 focus-visible:outline focus-visible:outline-blue-200 focus-visible:outline-offset-2"
          >
            Waiting list
          </ApplyButton>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id={MOBILE_MENU_ID}
          className="fixed inset-0 z-40 flex flex-col bg-white px-6 py-16 text-slate-900 backdrop-blur md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{publicEnv.brandName}</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              ×
            </button>
          </div>

          <div className="mt-10 flex flex-col gap-6 text-lg font-semibold text-slate-900">
            {primaryLinks.map((link) => (
              <a key={link.href} href={link.href} aria-label={link.ariaLabel} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-10">
            <ApplyButton
              source="mobile-nav-cta"
              plan="pilot-program"
              className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900"
              onClick={closeMenu}
            >
              Apply now
            </ApplyButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
