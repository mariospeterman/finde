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
          // Sticky = true when chat demo is NOT visible (above viewport)
          // Sticky = false when chat demo IS visible (in viewport)
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
      <div className="mx-auto w-full max-w-[860px]">
        <nav className="relative block h-[60px] rounded-2xl border border-white/30 bg-white/55 shadow-lg shadow-slate-900/10 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 flex h-[60px] items-center justify-between px-4">
            {/* Mobile Hamburger / Desktop Nav Links */}
            <div className="flex items-center gap-6">
          <button
            type="button"
                className={`group order-1 flex h-6 w-6 items-center justify-center gap-[3px] bg-transparent transition md:hidden ${
                  isMenuOpen ? 'opacity-60' : ''
                }`}
            aria-controls={MOBILE_MENU_ID}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={toggleMenu}
          >
            <span className="sr-only">{isMenuOpen ? "Close navigation menu" : "Open navigation menu"}</span>
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className={`h-[6px] w-[6px] rounded-full bg-slate-700 transition duration-300 ease-linear group-hover:opacity-75 ${
                      isMenuOpen ? 'scale-75 opacity-60' : ''
                    }`}
                  />
                ))}
          </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-label={link.ariaLabel}
                    className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-blue-200 focus-visible:outline-offset-2"
            >
              {link.label}
            </a>
          ))}
        </nav>
            </div>

            {/* Centered Logo */}
            <Link
              href="#hero"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center"
              aria-label={`${publicEnv.brandName} homepage`}
            >
              <Image 
                src="/logo.png" 
                alt={`${publicEnv.brandName} logo`} 
                width={104} 
                height={26} 
                priority 
                className="h-[32px] md:h-[44px] w-auto" 
              />
            </Link>

            {/* CTA Button */}
            <div className="flex items-center justify-end">
          <ApplyButton
            source="nav-cta"
            plan="pilot-program"
                className="inline-flex text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-blue-200 focus-visible:outline-offset-2"
          >
            Apply now
          </ApplyButton>
        </div>
          </div>
        </nav>
      </div>

      {isMenuOpen ? (
        <div
          id={MOBILE_MENU_ID}
          className="fixed inset-0 z-40 flex flex-col bg-white/95 px-6 py-16 text-blue-900 backdrop-blur md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-500">{publicEnv.brandName}</span>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 text-blue-700 transition hover:border-blue-300 hover:text-blue-500"
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
            <ApplyButton
              source="mobile-nav-cta"
              plan="pilot-program"
              className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 hover:text-blue-500"
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
