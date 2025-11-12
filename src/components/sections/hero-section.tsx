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
      { threshold: 0.35 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="hero" className="space-y-12">
      <NavigationBar />
      <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.618fr_1fr] lg:items-center">
        <div className="space-y-8 max-w-xl lg:max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-semibold text-slate-900 shadow-sm shadow-slate-900/5">
              <Sparkles className="h-4 w-4 text-sky-500" aria-hidden="true" focusable="false" />
              We all search. The difference is how quickly you find.
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              Search · Decide · Deliver
            </span>
          </div>
          <div className="space-y-6 lg:space-y-7">
            <div className="space-y-4">
              <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl md:text-6xl">
                Your knowledge, delivered in context.
              </h1>
              <p className="text-lg leading-relaxed text-slate-600">
                {publicEnv.brandName} threads your documents, chats, and wikis together. One search. Smarter next steps.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ApplyButton
                source="hero-primary"
                className="bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-white focus-visible:outline-offset-2 focus-visible:outline-2"
              >
                Start the pilot
              </ApplyButton>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-600"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <BeforeAfterSlider value={sliderValue} onChange={setSliderValue} className="flex-1" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid gap-3 text-xs uppercase tracking-[0.3em] text-slate-500 sm:grid-cols-3 sm:gap-2">
          {focusTransitions.map((transition) => (
            <div key={transition.from} className="flex items-center justify-center gap-3 rounded-full bg-white px-4 py-2">
              <span>{transition.from}</span>
                <ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" focusable="false" />
              <span>{transition.to}</span>
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {heroStats.map((stat) => (
            <div key={stat.label} className="paper-sheet flex flex-col gap-2 p-5 text-sm uppercase tracking-[0.3em] text-slate-500">
              <span className="text-2xl font-semibold text-slate-900">{stat.value}</span>
              <span className="text-slate-600">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Finde in action</p>
          <p className="text-sm text-slate-600">Clarity is the new productivity</p>
        </div>
        <div className="w-full" ref={chatRef}>
          <ChatPreview messages={chatMessages} metrics={chatMetrics} autoPlay isActive={chatActive} />
        </div>
      </div>
    </section>
  );
}
