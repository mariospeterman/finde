'use client';

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { publicEnv } from "@/lib/env";

export type ChatMessage = {
  sender: "user" | "assistant";
  time: string;
  text: string;
  meta?: string;
};

type ChatMetric = {
  label: string;
  value: string;
  context: string;
};

type ChatPreviewProps = {
  messages: ChatMessage[];
  metrics?: ChatMetric[];
  footer?: ReactNode;
  className?: string;
  autoPlay?: boolean;
  isActive?: boolean;
  revealIntervalMs?: number;
};

export function ChatPreview({
  messages,
  metrics,
  footer,
  className = "",
  autoPlay = false,
  isActive = true,
  revealIntervalMs = 400,
}: ChatPreviewProps) {
  const [visibleState, setVisibleState] = useState(0);
  const hasStarted = useRef(false);
  const totalMessages = messages.length;

  useEffect(() => {
    if (!autoPlay) {
      hasStarted.current = false;
      return;
    }

    if (!isActive || hasStarted.current) {
      return;
    }

    hasStarted.current = true;
    const frame = window.requestAnimationFrame(() => {
      setVisibleState(1);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [autoPlay, isActive]);

  useEffect(() => {
    if (!autoPlay || !hasStarted.current) {
      return;
    }

    if (visibleState >= totalMessages) {
      return;
    }

    const nextStep = window.setTimeout(() => {
      setVisibleState((count) => Math.min(count + 1, totalMessages));
    }, revealIntervalMs);

    return () => {
      window.clearTimeout(nextStep);
    };
  }, [autoPlay, visibleState, totalMessages, revealIntervalMs]);

  const visibleCount = autoPlay ? visibleState : messages.length;

  const displayedMessages = useMemo(
    () => messages.slice(0, Math.min(visibleCount, messages.length)),
    [messages, visibleCount],
  );
  const showMetrics = Boolean(metrics?.length) && (!autoPlay || visibleCount >= totalMessages);

  return (
    <div className={`paper-sheet flex flex-col gap-6 p-4 sm:p-6 lg:p-8 ${className}`}>
      <div className="mx-auto w-full max-w-2xl space-y-4 overflow-x-hidden" aria-live={autoPlay ? "polite" : undefined}>
        {displayedMessages.map((message, index) => {
          const isUser = message.sender === "user";
          return (
            <div key={`${message.sender}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[85%] sm:max-w-md rounded-3xl px-3 sm:px-4 py-2 sm:py-3 text-sm leading-relaxed ${
              isUser
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200/70"
                : "bg-white text-slate-900 border border-blue-100 shadow-sm"
            } transition-opacity duration-300`}
              >
                <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-slate-400">
                  {isUser ? "You" : publicEnv.brandName}
                  <span className="ml-2 text-slate-300">{message.time}</span>
                </div>
                <p className="mt-1 text-sm sm:text-base">{message.text}</p>
                {message.meta ? <p className="mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-sky-500">{message.meta}</p> : null}
              </div>
            </div>
          );
        })}
      </div>

      {showMetrics ? (
        <div className="mx-auto flex w-full max-w-2xl flex-wrap items-center justify-center gap-3">
          {metrics!.map((metric) => (
            <div key={metric.label} className="rounded-xl bg-white/90 px-4 py-2 text-center shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{metric.label}</div>
              <div className="text-lg font-semibold text-slate-900">{metric.value}</div>
              <div className="text-[10px] text-slate-600">{metric.context}</div>
            </div>
          ))}
        </div>
      ) : null}

      {footer}
    </div>
  );
}
