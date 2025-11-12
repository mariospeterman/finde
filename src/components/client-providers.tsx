'use client';

import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";

import { disableAnalytics, initAnalytics, capturePageview } from "@/lib/analytics";
import { usePathname } from "next/navigation";

const CONSENT_COOKIE = "findeCookieConsent";

const getConsentValue = () => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.split("=")[1]);
};

export function ClientProviders() {
  const pathname = usePathname();

  useEffect(() => {
    const consent = getConsentValue();
    if (consent === "true") {
      initAnalytics();
    } else if (consent === "false") {
      disableAnalytics();
    }
  }, []);

  useEffect(() => {
    if (!pathname) return;
    const consent = getConsentValue();
    if (consent === "true") {
      const search = typeof window !== "undefined" ? window.location.search : "";
      capturePageview({ pathname, search });
    }
  }, [pathname]);

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName={CONSENT_COOKIE}
        style={{ background: "#0f172a", fontSize: "14px", padding: "1.25rem 1.5rem" }}
        buttonStyle={{
          color: "#0f172a",
          background: "#f1f5f9",
          fontSize: "14px",
          borderRadius: "9999px",
          padding: "0.75rem 1.6rem",
          minHeight: "44px",
          lineHeight: "1.2",
        }}
        declineButtonStyle={{
          color: "#f1f5f9",
          background: "transparent",
          borderRadius: "9999px",
          padding: "0.75rem 1.6rem",
          border: "1px solid rgba(241,245,249,0.5)",
          minHeight: "44px",
          lineHeight: "1.2",
        }}
        ariaAcceptLabel="Accept cookies"
        ariaDeclineLabel="Decline cookies"
        overlay
        overlayClasses="backdrop-blur-sm bg-slate-950/40"
        containerClasses="!max-w-4xl !mx-auto !left-0 !right-0 !mb-6 !rounded-3xl !shadow-2xl"
        buttonWrapperClasses="flex flex-col gap-3 sm:flex-row"
        expires={180}
        onAccept={initAnalytics}
        onDecline={disableAnalytics}
        cookieSecurity
      >
        <span className="text-sm text-slate-100">
          We use analytics to learn what works and what doesn’t. Accepting cookies lets us improve the Finde experience. Read more in our
          <a href="#contact" className="ml-1 underline">
            privacy policy
          </a>
          .
        </span>
      </CookieConsent>
    </>
  );
}
