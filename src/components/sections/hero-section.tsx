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
    <section id="hero" className="space-y-12">
      <NavigationBar />
      <div className="grid gap-10 md:grid-cols-2 md:gap-14 lg:grid-cols-[1.618fr_1fr] lg:items-center">
        <div className="space-y-8 max-w-xl lg:max-w-2xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-700 shadow-sm shadow-blue-100">
              <Sparkles className="h-4 w-4 text-blue-500" aria-hidden="true" focusable="false" />
              We all search. The difference is how quickly you find.
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
                className="bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-300 focus-visible:outline-offset-2 focus-visible:outline-2"
              >
                Apply for pilot
              </ApplyButton>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:text-blue-900"
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
        <div className="grid gap-3 text-xs uppercase tracking-[0.3em] text-blue-600 sm:grid-cols-3 sm:gap-2" role="list" aria-label="Focus transitions">
          {focusTransitions.map((transition) => (
            <div key={transition.from} className="flex items-center justify-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm shadow-blue-50" role="listitem">
              <span>{transition.from}</span>
                <ArrowRight className="h-3 w-3 text-blue-300" aria-hidden="true" focusable="false" />
              <span>{transition.to}</span>
            </div>
          ))}
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Hero statistics">
          {heroStats.map((stat) => (
            <div key={stat.label} className="paper-sheet flex flex-col gap-2 p-5 text-sm uppercase tracking-[0.3em] text-blue-600">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-2xl font-semibold text-slate-900" aria-label={`${stat.value} ${stat.label}`}>{stat.value}</dd>
              <dd className="text-slate-500">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="space-y-4" data-chat-demo>
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
