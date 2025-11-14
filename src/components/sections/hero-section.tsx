'use client';

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import { BeforeAfterSlider } from "@/components/before-after-slider";
import { ChatPreview } from "@/components/chat-preview";
import { chatMessages, chatMetrics, focusTransitions, heroStats } from "@/data/content";
import { publicEnv } from "@/lib/env";
import { NavigationBar } from "@/components/navigation-bar";
import { ApplyButton } from "@/components/apply-button";

export function HeroSection() {
  const [sliderValue, setSliderValue] = useState(58);
  const [chatActive, setChatActive] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = chatRef.current;
    if (!node) {
      return undefined;
    }

    let triggered = false;
    // Use a more aggressive threshold and rootMargin to trigger earlier
    const observer = new IntersectionObserver(
      (entries) => {
        if (triggered) {
          return;
        }

        if (entries.some((entry) => entry.isIntersecting)) {
          triggered = true;
          setChatActive(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, // Trigger when 10% visible instead of 35%
        rootMargin: '100px', // Start loading 100px before it comes into view
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="hero" className="space-y-16">
      <NavigationBar />
      <div className="rounded-3xl border border-slate-200/60 bg-white px-6 py-12 shadow-sm sm:px-10 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-blue-500" aria-hidden="true" focusable="false" />
              Designed for clarity-first teams
            </span>
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl">
                Find the answer once. Share it everywhere.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-slate-600">
                {publicEnv.brandName} unifies your knowledge across docs, chats, and wikis so experts and operators stay aligned.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ApplyButton
                source="hero-primary"
                className="bg-blue-600 px-8 text-white shadow-sm shadow-blue-200 transition hover:bg-blue-500 focus-visible:outline-blue-300 focus-visible:outline-offset-2 focus-visible:outline-2"
              >
                Apply for pilot
              </ApplyButton>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                Learn how it works
                <ArrowRight className="h-4 w-4" aria-hidden="true" focusable="false" />
              </a>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
                AI answers grounded in citations, datasets, and audit trails.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
                Rollout playbooks for legal, HR, and revenue teams in weeks.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden="true" />
                Keep knowledge private with fully self-hosted or hybrid options.
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
              <BeforeAfterSlider value={sliderValue} onChange={setSliderValue} className="flex-1" />
              <p className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-500 text-center">
                Drag to see how teams move from searching to delivering
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3 text-sm font-semibold text-blue-700">
                <Sparkles className="h-4 w-4" aria-hidden="true" focusable="false" />
                Clarity index
              </div>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                    <dt className="text-xs uppercase tracking-[0.3em] text-slate-500">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-slate-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3" role="list" aria-label="Focus transitions">
        {focusTransitions.map((transition) => (
          <div key={transition.from} className="paper-sheet flex items-center justify-between gap-3 px-5 py-4" role="listitem">
            <span className="font-semibold text-slate-500">{transition.from}</span>
            <ArrowRight className="h-4 w-4 text-blue-200" aria-hidden="true" focusable="false" />
            <span className="font-semibold text-slate-900">{transition.to}</span>
          </div>
        ))}
      </div>

      <div className="paper-sheet space-y-6 p-8 md:p-10" data-chat-demo>
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Finde in action</p>
          <p className="text-sm text-slate-600">See a pilot-grade chat experience with live citations</p>
        </div>
        <div className="w-full" ref={chatRef}>
          <ChatPreview messages={chatMessages} metrics={chatMetrics} autoPlay isActive={chatActive} />
        </div>
      </div>
    </section>
  );
}
